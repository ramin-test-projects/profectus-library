"use client";

import { API } from "@/api/Api";
import { SearchBooksResponse } from "@/api/ApiBase";
import { useApi } from "@/api/useApi";
import { LoadingIconFlat } from "@/components/icons/LoadingIconFlat";
import { useAuthContext } from "@/context/auth-provider/AuthProvider";
import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Subject, catchError, debounceTime, filter, from, of, switchMap, tap } from "rxjs";
import { BookItem } from "./BookItem";
import ReactVisibilitySensor from "react-visibility-sensor";
import { LoadingFlat } from "@/components/loading/LoadingFlat";

const debounceTimeout = 1000;

export const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [scrollEndLocked, setScrollEndLocked] = useState<boolean>(false);

  const { requestParams } = useAuthContext();

  const subjectRef = useRef(new Subject<{ term?: string; more: boolean }>());
  const scrollSubjectRef = useRef(new Subject<void>());

  const [searchResponse, setSearchResponse] = useState<SearchBooksResponse | undefined>();
  const lowerBoundaryRef = useRef<number>(1);
  const endResultRef = useRef<boolean>(false);

  const { call: searchBooks } = useApi(API.searchBooks);

  useEffect(() => {
    const subscription = subjectRef.current
      .pipe(
        filter(() => !endResultRef.current),
        tap((value) => {
          setIsLoading(true);

          if (!value.more) {
            setSearchResponse(undefined);
            lowerBoundaryRef.current = 1;
          }
        }),
        debounceTime(debounceTimeout),
        switchMap((value) =>
          from(
            searchBooks(
              value.term,
              { count: 20, lowerBoundary: lowerBoundaryRef.current },
              requestParams
            )
          ).pipe(catchError(() => of()))
        )
      )
      .subscribe((result) => {
        const value = result as SearchBooksResponse | undefined;
        setIsLoading(false);
        setSearchResponse((cur) => {
          const totalCount = value?.totalCount ?? cur?.totalCount;
          const books = [...(cur?.books ?? []), ...(value?.books ?? [])];

          if (books.length >= (totalCount ?? 0)) endResultRef.current = true;

          scrollSubjectRef.current.next();

          return { totalCount, books };
        });
        lowerBoundaryRef.current += value?.books?.length ?? 0;
      });

    const scrollEndSubscription = scrollSubjectRef.current
      .pipe(
        tap(() => setScrollEndLocked(true)),
        debounceTime(debounceTimeout)
      )
      .subscribe(() => setScrollEndLocked(false));

    return () => {
      subscription.unsubscribe();
      scrollEndSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    endResultRef.current = false;
    subjectRef.current.next({ term: searchTerm, more: false });
  }, [searchTerm]);

  const lastIndex = (searchResponse?.books?.length ?? 0) - 1;

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex-grow-0 flex-shrink-0 flex flex-row">
        <div className="flex-auto">
          <TextField
            className="w-[22rem]"
            variant="standard"
            placeholder="Search books by title, authors, and publisher"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {!!searchResponse?.totalCount && (
          <div className="flex-grow-0 flex-shrink-0 flex items-center">{`${searchResponse.totalCount.toLocaleString("en-US")} items`}</div>
        )}
      </div>
      <div className="flex-auto flex flex-col gap-2">
        {(searchResponse?.books ?? []).map((book, index) =>
          index === lastIndex ? (
            <ReactVisibilitySensor
              key={book.id}
              onChange={() => {
                if (!scrollEndLocked && !endResultRef.current) {
                  scrollSubjectRef.current.next();
                  subjectRef.current.next({ term: searchTerm, more: true });
                }
              }}
            >
              <BookItem book={book} />
            </ReactVisibilitySensor>
          ) : (
            <BookItem key={book.id} book={book} />
          )
        )}
        {isLoading && <LoadingFlat />}
        {!isLoading && !searchResponse?.books?.length && !!searchTerm && (
          <div className="text-center font-medium p-4" style={{ color: "rgb(100, 100, 100)" }}>
            {`Sorry! We couldn't find any books for '${searchTerm}'.`}
          </div>
        )}
      </div>
    </div>
  );
};
