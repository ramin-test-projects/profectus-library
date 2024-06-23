"use client";

import { API } from "@/api/Api";
import { useApi } from "@/api/useApi";
import { useEffect, useState } from "react";
import { LoadingFlat } from "../loading/LoadingFlat";
import { useAuthContext } from "@/context/auth-provider/AuthProvider";
import { FormField } from "./FormField";
import { Book as IBook } from "@/api/ApiBase";
import { formatDate } from "@/util/util";
import { Button } from "@mui/material";
import { LoadingButtonLabel } from "../loading/LoadingButtonLabel";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants/routes";

export const Book = ({ bookId, ...restParams }: { bookId?: string; editMode?: boolean }) => {
  const router = useRouter();

  const [editMode, setEditMode] = useState<boolean>(!!restParams.editMode);
  const [book, setBook] = useState<IBook | undefined>();
  const [editableBook, setEditableBook] = useState<IBook | undefined>();
  const [error, setError] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);

  const { requestParams, auth } = useAuthContext();

  const { call: getBookById, isLoading, isError: notFound } = useApi(API.getBookById);
  const { call: addBook, isLoading: isAddingBook } = useApi(API.addBook);
  const { call: updateBook, isLoading: isUpdatingBook } = useApi(API.updateBook);
  const { call: deleteBook, isLoading: isDeletingBook } = useApi(API.deleteBook);

  useEffect(() => {
    (async () => {
      if (bookId) {
        const book = await getBookById(bookId, requestParams);
        setBook(book);
      }
    })();
  }, [bookId]);

  const handleSave = () => {
    if (isAddingBook || isUpdatingBook) return;

    if (
      !editableBook?.title ||
      !editableBook.authors ||
      !editableBook.isbn ||
      !editableBook.publisher ||
      !editableBook.publication_date
    ) {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 300);
    } else {
      (async () => {
        if (editableBook.id) {
          await updateBook(editableBook, requestParams);
          setBook(editableBook);
        } else {
          const newBook = await addBook(editableBook, requestParams);
          setBook(newBook);
          router.push(`${Routes.book.fullPath}/${newBook?.bookId || newBook?.id}`);
        }

        setEditMode(false);
        setError(false);
        setShake(false);
        setEditableBook(undefined);
      })();
    }
  };

  const handleDelete = () => {
    if (isDeletingBook) return;

    (async () => {
      await deleteBook(book?.id ?? "", requestParams);
      setDeleted(true);

      setEditMode(false);
      setError(false);
      setShake(false);
      setEditableBook(undefined);
    })();
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {isLoading && <LoadingFlat />}
      {notFound && (
        <div className="p-8 text-xl font-medium text-slate-900 text-center">
          {"Sorry! The book doesn't exist :("}
        </div>
      )}
      {(!!book?.id || editMode) && !notFound && (
        <div className="flex flex-col gap-2 p-4 w-full max-w-[44rem] bg-white rounded-lg border-solid border-[1px] border-b-slate-300">
          <FormField
            label="Title"
            value={book?.title}
            editMode={editMode}
            inputValue={editableBook?.title}
            onChange={(value) => setEditableBook((b) => ({ ...b, title: value }))}
            required
            shake={shake}
            error={error}
          />
          <FormField
            label="Authors"
            value={book?.authors}
            editMode={editMode}
            inputValue={editableBook?.authors}
            onChange={(value) => setEditableBook((b) => ({ ...b, authors: value }))}
            required
            shake={shake}
            error={error}
          />
          <FormField
            label="ISBN"
            value={book?.isbn}
            editMode={editMode}
            inputValue={editableBook?.isbn}
            onChange={(value) => setEditableBook((b) => ({ ...b, isbn: value }))}
            required
            shake={shake}
            error={error}
          />
          <FormField
            label="ISBN 13"
            value={book?.isbn13}
            editMode={editMode}
            inputValue={editableBook?.isbn13}
            onChange={(value) => setEditableBook((b) => ({ ...b, isbn13: value }))}
          />
          <FormField
            label="Average rating"
            value={book?.average_rating}
            editMode={editMode}
            inputValue={editableBook?.average_rating}
            inputType="number"
            onChange={(value) => setEditableBook((b) => ({ ...b, average_rating: +value }))}
          />
          <FormField
            label="Language code"
            value={book?.language_code}
            editMode={editMode}
            inputValue={editableBook?.language_code}
            onChange={(value) => setEditableBook((b) => ({ ...b, language_code: value }))}
          />
          <FormField
            label="Pages"
            value={book?.num_pages}
            editMode={editMode}
            inputValue={editableBook?.num_pages}
            inputType="number"
            onChange={(value) => setEditableBook((b) => ({ ...b, num_pages: +value }))}
          />
          <FormField
            label="Ratings"
            value={book?.ratings_count}
            editMode={editMode}
            inputValue={editableBook?.ratings_count}
            inputType="number"
            onChange={(value) => setEditableBook((b) => ({ ...b, ratings_count: +value }))}
          />
          <FormField
            label="Reviews"
            value={book?.text_reviews_count}
            editMode={editMode}
            inputValue={editableBook?.text_reviews_count}
            inputType="number"
            onChange={(value) => setEditableBook((b) => ({ ...b, text_reviews_count: +value }))}
          />
          <FormField
            label="Publisher"
            value={book?.publisher}
            editMode={editMode}
            inputValue={editableBook?.publisher}
            onChange={(value) => setEditableBook((b) => ({ ...b, publisher: value }))}
            required
            shake={shake}
            error={error}
          />
          <FormField
            label="Publication date"
            value={book?.publication_date}
            displayValue={formatDate(book?.publication_date)}
            editMode={editMode}
            inputValue={editableBook?.publication_date}
            inputType="date"
            onChange={(value) => setEditableBook((b) => ({ ...b, publication_date: value }))}
            required
            shake={shake}
            error={error}
          />
          {auth?.isAdmin && !deleted && (
            <div className="mt-4 flex flex-row justify-center gap-4">
              {!!book?.id && !editMode && (
                <>
                  <Button
                    variant="contained"
                    className="w-24"
                    onClick={() => {
                      setEditMode(true);
                      setEditableBook(book ?? {});
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="contained" color="error" className="w-24" onClick={handleDelete}>
                    {isDeletingBook ? <LoadingButtonLabel /> : "Delete"}
                  </Button>
                </>
              )}
              {editMode && (
                <Button variant="contained" className="w-24" onClick={handleSave}>
                  {isAddingBook || isUpdatingBook ? (
                    <LoadingButtonLabel />
                  ) : book?.id ? (
                    "Save"
                  ) : (
                    "Add"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
