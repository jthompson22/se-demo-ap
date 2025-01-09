'use client';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Form from 'next/form';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
// import { revalidateTag } from 'next/cache';
import { revalidate } from '@/db/client-server-actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Submitting...
        </div>
      ) : (
        'Submit Feedback'
      )}
    </button>
  );
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  type: 'like' | 'dislike';
  submitFeedback: any;
  slug: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  postId,
  type,
  submitFeedback,
  slug,
}: FeedbackModalProps) {
  const router = useRouter();
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  {type === 'like'
                    ? 'What did you like?'
                    : 'What could be improved?'}
                </Dialog.Title>

                <Form
                  action={async (formData: FormData) => {
                    formData.append('postId', postId);
                    formData.append('type', type);

                    const result = await submitFeedback(
                      postId,
                      type,
                      formData.get('comment') as string,
                      slug,
                    );

                    await revalidate(`metrics-${postId}`);
                    if (result.success) {
                      onClose();
                      router.push('/');
                    }
                  }}
                  className="mt-4"
                >
                  <textarea
                    name="comment"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Share your thoughts..."
                    required
                  />

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <SubmitButton />
                  </div>
                </Form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
