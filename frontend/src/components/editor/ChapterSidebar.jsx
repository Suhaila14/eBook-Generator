import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Trash2, Plus, GripVertical } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Button from "../ui/Button";
//Sortable Item component
const SortableItem = ({
  chapter,
  index,
  selectedChapterIndex,
  onSelectChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter._id || `new-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
    >
      <button
        className={`flex-1 flex items-center p-3 text-sm rounded-l-lg text-left transition-colors ${
          selectedChapterIndex === index
            ? "bg-violet-50/50 text-violet-800 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`}
        onClick={() => onSelectChapter(index)}
      >
        <GripVertical
          className="w-4 h-4 text-slate-400 mr-2 cursor-grab"
          {...listeners} //With this the icon becomes drag trigger, When user drags this icon, start drag operation
          {...attributes}
        />
        <span className="truncate">{chapter.title}</span>
      </button>
      <div className="flex items-center ml-2 bg-white opacity-0 group-hover:opacity-100 trasition-opacity px-2 py-3 absolute right-0">
        <Button
          varient="ghost"
          size="small"
          className="py-2 px-2 "
          onClick={() => onGenerateChapterContent(index)}
          isLoading={isGenerating === index}
          title="Generate Content with AI"
        >
          {isGenerating !== index && (
            <Sparkles className="w-3.5 h-3.5 text-violet-800" />
          )}
        </Button>
        <Button
          varient="ghost"
          size="small"
          className="py-2 px-2"
          onClick={() => onDeleteChapter(index)}
          title="Delete Chapter"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

const ChapterSidebar = ({
  book,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  selectedChapterIndex,
  onGenerateChapterContent,
  isGenerating,
  onReorderChapters,
}) => {
  const navigate = useNavigate();

  const chapterIds = book.chapters.map(
    (chapter, index) => chapter._id || `new-${index}`,
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = chapterIds.indexOf(active.id); // ex: Chapter Three was at index 2
      const newIndex = chapterIds.indexOf(over.id);
      onReorderChapters(oldIndex, newIndex);
    }
  };
  return (
    <aside className="w-80 h-full bg-white flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <Button
          varient="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2
          className="text-base font-bold text-slate-800 mt-4 truncate"
          title={book.title}
        >
          {book.title}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <DndContext
          collisionDetection={closestCenter} //when dragging, Choose the item whose center is closest to the dragged item and palce it there.
          onDragEnd={handleDragEnd} //When the user finishes dragging, this function runs.
        >
          <SortableContext
            items={chapterIds}
            strategy={verticalListSortingStrategy} //This tells dnd-kit That the items are arranged vertically (top to bottom).
          >
            <div className="p-4 space-y-2">
              {book.chapters.map((chapter, index) => (
                <SortableItem
                  key={chapter._id || `new-${index}`}
                  chapter={chapter}
                  index={index}
                  selectedChapterIndex={selectedChapterIndex}
                  onSelectChapter={onSelectChapter}
                  onDeleteChapter={onDeleteChapter}
                  onGenerateChapterContent={onGenerateChapterContent}
                  isGenerating={isGenerating}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="p-4 border-t border-slate-200">
        <Button
          varient="secondary"
          onClick={onAddChapter}
          className="w-full"
          icon={Plus}
        >
          New Chapter
        </Button>
      </div>
    </aside>
  );
};

export default ChapterSidebar;
