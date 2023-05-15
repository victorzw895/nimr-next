// import { Droppable, useDragDropContext } from "@thisbeyond/solid-dnd";
// import { Dynamic } from 'solid-js/web';  
import { ReactNode, FC, useState, Dispatch, SetStateAction } from 'react';
import { DndContext, closestCenter, DragEndEvent, DroppableContainer, Active } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import {
//   DragDropProvider,
//   DragDropSensors,
//   DragOverlay,
//   SortableProvider,
//   createSortable,
//   // closestCenter,
//   Draggable,
// } from "@thisbeyond/solid-dnd";
// import { For, Show, JSXElement, Component, createSignal, ParentComponent } from "solid-js";
// import { SetStoreFunction } from "solid-js/store";

interface SortableProps {
  // item: {
  //   id: number,
  // },
  id: number,
  children: ReactNode
}

const Sortable: FC<SortableProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: props.id}); 

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  // const sortable = createSortable(props.item.id, props.item);
  // const [state] = useDragDropContext();
  return (
    <div
      // use:sortable
      // class="sortable"
      // classList={{
      //   "opacity-25": sortable.isActiveDraggable,
      //   "transition-transform": !!state.active.draggable,
      // }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
};

interface SortableItem {
  id: number,
}

export interface DraggableItemProps<T> {
  item: T,
  overlay?: boolean
}

export interface SortableListProps<T> {
  draggableContainer: (SortableItem: FC<DraggableItemProps<T>>) => ReactNode
  updatedValues: any[],
  showWatchList: boolean,
  setShowWatchList: Dispatch<SetStateAction<boolean>>
}

const withSortableList = <
  TData extends SortableItem,
>(
  SortableComponent: FC<SortableListProps<TData>>,
  sortableList: TData[],
  setSortableList: Dispatch<SetStateAction<TData[]>>,
  showWatchList: boolean,
  setShowWatchList: Dispatch<SetStateAction<boolean>>,
) => {
  // eslint-disable-next-line react/display-name
  return (props: Omit<SortableListProps<TData>, keyof SortableListProps<TData>>) => {
    const [activeItem, setActiveItem] = useState<TData | null>(null);
    const [updatedValues, setUpdatedValues] = useState<TData[]>([]);

    const ids = () => sortableList.map(item => item.id);

    const onDragStart = ({active}: {active: Active}) => {
      const draggedItem = sortableList.find(item => item.id === active.id)
      setActiveItem((_) => draggedItem || null)
    };
  
    // const onDragOver = ({ draggable, droppable }: { draggable: DragStartEvent, droppable: DroppableContainer }) => {
    //   if (draggable && droppable) {
    //     // const currentItems = sortableList;
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
  
    //     // setSortableList(updatedItemRanks);
  
    //     const draggedItem = sortableList.find(item => item.id === draggable.id)
    //     setActiveItem((_) => draggedItem ? ({
    //       ...draggedItem,
    //       rank: toIndex + 1
    //     }) : null)
    //   }
    // }
  
    const onDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (active && over) {
        const currentItems = sortableList;
        const fromIndex = ids().indexOf(Number(active.id));
        const toIndex = ids().indexOf(Number(over.id));
        if (fromIndex !== toIndex) {
          const updatedItems = currentItems.slice();
          updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
          const updatedItemRanks = updatedItems.map((item, index) => ({
            ...item,
            rank: index + 1
          }))
          
          setUpdatedValues(updatedItemRanks.filter((_, index) => {
            if (fromIndex < toIndex) {
              return index >= fromIndex && index <= toIndex
            }
            else {
              return index >= toIndex && index <= fromIndex
            }
          }))
          setSortableList(updatedItemRanks);
        }
      }
    };
  
    return (
      <SortableComponent 
        {...(props as SortableListProps<TData>)}
        showWatchList={showWatchList}
        setShowWatchList={setShowWatchList}
        updatedValues={updatedValues}
        draggableContainer={
          (SortableItem) => (
            <DndContext
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              // onDragOver={onDragOver}
              collisionDetection={closestCenter}
            >
              <SortableContext
                items={ids()}
                strategy={verticalListSortingStrategy}
              >
                {sortableList.map(item => 
                <>
                  <Sortable
                    key={item.id}
                    id={item.id}
                  >
                        <SortableItem item={item} />

                  </Sortable>
                </>
                )}
              </SortableContext>
              {/* <DragDropSensors />
              <SortableProvider ids={ids()}>
                
                <Dynamic component={() => 
                  <For each={sortableList} fallback={<div>Loading...</div>}>
                    {
                      (item) => 
                      <Sortable item={item} id={item.id}>
                        <SortableItem item={item} />
                      </Sortable>
                    }
                  </For>
                } />
        
              </SortableProvider>
              <DragOverlay>
                <div class="sortable">
                  <Show when={!!activeItem()}>
                    <SortableItem item={activeItem()} overlay />
                  </Show>
                </div>
              </DragOverlay> */}
            </DndContext>
            )
        }
      />
    );
  }
}

export default withSortableList;