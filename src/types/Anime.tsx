
type ImageSizes = 'original' | 'tiny' | 'small' | 'medium' | 'large'
interface Images extends Record<ImageSizes, string> {
    meta: {
        dimensions: Record<ImageSizes, {
            width: number,
            height: number
        }>
    }
}

export interface Anime {
    id: number,
    attributes: {
        'createdAt': string,
        'updatedAt': string,
        'slug': string,
        'synopsis': string,
        'description': string,
        'coverImageTopOffset': number,
        'titles': Record<'en' | 'en_jp' | 'ja_jp', string>,
        'canonicalTitle': string,
        'abbreviatedTitles': string[],
        'averageRating': string,
        'ratingFrequencies': Record<string, string>,
        'userCount': number,
        'favoritesCount': number,
        'startDate': string,
        'endDate': string,
        'nextRelease': null,
        'popularityRank': number,
        'ratingRank': number,
        'ageRating': string,
        'ageRatingGuide': string,
        'subtype': string,
        'status': string,
        'tba': null,
        'posterImage': Images,
        'coverImage': Images,
        'episodeCount': number,
        'episodeLength': number,
        'totalLength': number,
        'youtubeVideoId': string,
        'showType': string,
        'nsfw': boolean,
    },
    rank: number | null,
    stars: number,
    isWatched: boolean,
    seasonYear: number,
    watchlist: boolean,
}

export type AnimesByYear = Record<string, Anime[]>
