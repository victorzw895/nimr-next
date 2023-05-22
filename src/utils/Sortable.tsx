import { upsertAnime } from '@/lib/api';
import { ReactNode, FC, useState, Dispatch, SetStateAction } from 'react';
import { DndContext, closestCenter, DragEndEvent, Active, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Anime } from '@/types/Anime';

export interface SortableItemProps {
  id: number,
  children: ReactNode
}

export const SortableItem: FC<SortableItemProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: props.id}); 

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
};

export interface SortableListProps {
  children: ReactNode,
  list: any[],
  setList: Dispatch<SetStateAction<any[]>>
}

export const SortableList: FC<SortableListProps> = ({children, list, setList}) => {
  const [activeItem, setActiveItem] = useState<Anime | null>(null);

  const ids = () => list.map(item => item.id);

  const onDragStart = ({active}: {active: Active}) => {
    const draggedItem = list.find(item => item.id === active.id)
    setActiveItem((_) => draggedItem || null)
  };

  // const onDragOver = ({ draggable, droppable }: { draggable: DragStartEvent, droppable: DroppableContainer }) => {
  //   if (draggable && droppable) {
  //     // const currentItems = list;
  //     // const fromIndex = ids().indexOf(Number(draggable.id));
  //     const toIndex = ids().indexOf(Number(droppable.id));
  //     // if (cardRef) {
  //     //   cardRef.scrollIntoView({
  //     //     behavior: 'smooth',
  //     //     block: 'start',
  //     //   })
  //     // }

  //     // TODO update all cards ranks as active draggable
  //     // const updatedItems = currentItems.slice();
  //     // updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
  //     // const updatedItemRanks = updatedItems.map((anime, index) => ({
  //     //   ...anime,
  //     //   rank: index + 1
  //     // }))

  //     // setList(updatedItemRanks);

  //     const draggedItem = list.find(item => item.id === draggable.id)
  //     setActiveItem((_) => draggedItem ? ({
  //       ...draggedItem,
  //       rank: toIndex + 1
  //     }) : null)
  //   }
  // }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over) {
      const currentItems = list;
      const fromIndex = ids().indexOf(Number(active.id));
      const toIndex = ids().indexOf(Number(over.id));
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        const updatedItemRanks = updatedItems.map((item, index) => ({
          ...item,
          rank: index + 1
        }))

        const changedValues = updatedItemRanks.filter((_, index) => {
          if (fromIndex < toIndex) {
            return index >= fromIndex && index <= toIndex
          }
          else {
            return index >= toIndex && index <= fromIndex
          }
        })
        
        upsertAnime(changedValues)
        // updateDb(changedValues)
        setList((_) => updatedItemRanks);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      // onDragOver={onDragOver}
      collisionDetection={closestCenter}
      sensors={sensors}
    >
      <SortableContext
        items={ids()}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  )
}
