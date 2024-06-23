import { Book } from "@/components/Book/Book";

export default function BookPage({ params }: { params: { id: string } }) {
  const isNew = params.id.toLowerCase() === "new";
  const bookId = isNew ? undefined : params.id;

  return (
    <div>
      <Book bookId={bookId} editMode={isNew} />
    </div>
  );
}
