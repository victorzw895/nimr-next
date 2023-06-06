import { FunctionComponent, useRef, useEffect } from "react";
import Image from "next/image";
import useAnime from '@/hooks/useAnime';

export interface CardProps {
  id: number,
  japName: string,
  engName: string,
  poster: string,
  selectAnime: () => void,
  rank: number | null,
  stars: number | null,
}

const Card: FunctionComponent<CardProps> = (props) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const { focusAnimeId } = useAnime();

  useEffect(() => {
    if (!cardRef.current) return;
    if (focusAnimeId === props.id) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [cardRef, props.id, focusAnimeId])

  return (
    <div key={props.id} ref={cardRef} data-testid='card' className='flex items-center bg-dark' onClick={props.selectAnime}>
      {
        props.poster ?
          <Image
            className='h-18 m-2 flex-grow-0'
            src={props.poster}
            height={64}
            width={45}
            alt={`${props.engName}-image`}
          />
            :
          <div className='h-16 w-11 m-2'></div>
      }
      <div className='mx-2 overflow-hidden'>
        <p data-testid='jap-name' className='truncate'>{props.japName}</p>
        <p data-testid='eng-name' className='text-xs truncate'>{props.engName}</p>
      </div>
      {!!props.rank &&
        <div className='ml-auto mr-3 flex-grow-0'>
          <p data-testid='rank' className='text-3xl'>{props.rank}</p>
          <p data-testid='stars' className='text-xs'>{props.stars ? props.stars : 0}</p>
        </div> 
      }
    </div>
  )
}

export default Card;