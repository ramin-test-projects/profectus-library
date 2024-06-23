import { Book } from "@/api/ApiBase";
import { Tag } from "./Tag";
import { formatDate } from "@/util/util";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants/routes";

export const BookItem = ({ book }: { book: Book }) => {
  const router = useRouter();

  return (
    <div
      className="p-2 rounded-md bg-white border-solid border-[1px] border-b-slate-300 cursor-pointer hover:bg-slate-50"
      onClick={() => router.push(`${Routes.book.fullPath}/${book.bookId || book.id}`)}
    >
      <h2 className="font-medium">{book.title}</h2>
      <h6 className="text-xs" style={{ color: "rgb(100, 100, 100)" }}>
        {book.authors}
      </h6>
      <h6 className="text-xs" style={{ color: "rgb(100, 100, 100)" }}>
        {`Publisher: ${book.publisher}`}
      </h6>
      <div className="flex flex-row gap-2 mt-2">
        <Tag value={book.average_rating} />
        <Tag value={formatDate(book.publication_date)} />
        <Tag label={"Published at"} value={formatDate(book.publication_date)} />
        <Tag label={"Pages"} value={book.num_pages?.toLocaleString("en-US")} />
        <Tag label={"Ratings"} value={book.ratings_count?.toLocaleString("en-US")} />
        <Tag label={"Reviews"} value={book.text_reviews_count?.toLocaleString("en-US")} />
      </div>
    </div>
  );
};
