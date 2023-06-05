import { ReactNode, FC } from "react";
import { Anime } from '@/types/Anime';
import LazyScroll, { LazyScrollProps } from "@/utils/LazyScroll";
import { SortableList, SortableListProps, SortableItem, SortableItemProps } from '@/utils/Sortable';
import Card from './Card';
import { useSelectedAnime } from '@/hooks/usePreview';

interface BaseListProps {
  list: Anime[],
  sortable?: boolean,
  showRank?: boolean,
  lazyScroll?: boolean,
  updateDb?: (anime: Anime | Anime[]) => Promise<Anime[] | null>
}

interface ConditionalWrapperProps<TWrapperProps> {
  condition: boolean,
  Wrapper: FC<TWrapperProps>,
  children: ReactNode,
}

interface DynamicProps extends ConditionalWrapperProps<any> {
  [x: string]: unknown
}

const ConditionalWrapper = ({condition, Wrapper, children, ...restProps}: DynamicProps) => condition ? <Wrapper {...restProps}>{children}</Wrapper> : <>{children}</>;

type DynamicWrapperProps<TProps> = Omit<ConditionalWrapperProps<TProps>, 'Wrapper'> & {[x: string]: unknown}

const SortableWrapper = ({children, ...restProps}: DynamicWrapperProps<SortableListProps>) => <ConditionalWrapper Wrapper={SortableList} {...restProps}>{children}</ConditionalWrapper>

const SortableItemWrapper = ({children, ...restProps}: DynamicWrapperProps<SortableItemProps>) => <ConditionalWrapper Wrapper={SortableItem} {...restProps}>{children}</ConditionalWrapper>

const LazyScrollWrapper = ({children, ...restProps}: DynamicWrapperProps<LazyScrollProps>) => <ConditionalWrapper Wrapper={LazyScroll} {...restProps}>{children}</ConditionalWrapper>

type ListProps = FC<BaseListProps & {[x: string]: unknown}>

const List: ListProps = ({
  list,
  sortable = false,
  showRank = false,
  lazyScroll = true,
  updateDb = null,
  ...restProps
}) => {
  const { setSelectedAnime } = useSelectedAnime();

  return (
    <SortableWrapper condition={sortable} list={list} updateDb={updateDb} {...restProps} >
      <LazyScrollWrapper
        condition={lazyScroll}
        list={list}
        {...restProps}
      >
        {
          list.map(anime => 
            <SortableItemWrapper key={anime.id} condition={sortable} id={anime.id}>
              <Card
                key={anime.id}
                id={anime.id}
                selectAnime={() => {
                  setSelectedAnime('TOGGLE_ANIME', anime);
                }}
                japName={anime.attributes.titles.en_jp || ''} 
                engName={anime.attributes.titles.en || ''}
                poster={anime.attributes.posterImage?.tiny || ''}
                rank={showRank ? anime.rank : null}
                stars={showRank ? anime.stars : null}
              />
            </SortableItemWrapper>
          )
        }
      </LazyScrollWrapper>
    </SortableWrapper>
  )
}

export default List;