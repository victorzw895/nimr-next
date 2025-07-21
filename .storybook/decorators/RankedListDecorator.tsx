import { RankedListProvider } from '@/context/RankedListContext';
import { Anime } from '@/types/Anime';
import { Decorator } from '@storybook/nextjs';
import React, { useState } from 'react';

const fakeAnime = {
  "id": 244,
  "attributes": {
      "createdAt": "2013-02-20T16:04:03.218Z",
      "updatedAt": "2023-03-31T06:00:04.435Z",
      "slug": "anime",
      "synopsis": "Ichigo Kurosaki is an ordinary high schooler—until his family is attacked by a Hollow, a corrupt spirit that seeks to devour human souls. It is then that he meets a Soul Reaper named Rukia Kuchiki, who gets injured while protecting Ichigo's family from the assailant. To save his family, Ichigo accepts Rukia's offer of taking her powers and becomes a Soul Reaper as a result.\nHowever, as Rukia is unable to regain her powers, Ichigo is given the daunting task of hunting down the Hollows that plague their town. However, he is not alone in his fight, as he is later joined by his friends—classmates Orihime Inoue, Yasutora Sado, and Uryuu Ishida—who each have their own unique abilities. As Ichigo and his comrades get used to their new duties and support each other on and off the battlefield, the young Soul Reaper soon learns that the Hollows are not the only real threat to the human world.\n[Written by MAL Rewrite]",
      "description": "Ichigo Kurosaki is an ordinary high schooler—until his family is attacked by a Hollow, a corrupt spirit that seeks to devour human souls. It is then that he meets a Soul Reaper named Rukia Kuchiki, who gets injured while protecting Ichigo's family from the assailant. To save his family, Ichigo accepts Rukia's offer of taking her powers and becomes a Soul Reaper as a result.\nHowever, as Rukia is unable to regain her powers, Ichigo is given the daunting task of hunting down the Hollows that plague their town. However, he is not alone in his fight, as he is later joined by his friends—classmates Orihime Inoue, Yasutora Sado, and Uryuu Ishida—who each have their own unique abilities. As Ichigo and his comrades get used to their new duties and support each other on and off the battlefield, the young Soul Reaper soon learns that the Hollows are not the only real threat to the human world.\n[Written by MAL Rewrite]",
      "coverImageTopOffset": 0,
      "titles": {
          "en": "Anime",
          "en_jp": "ANIME",
          "ja_jp": "ANIME"
      },
      "canonicalTitle": "ANIME",
      "abbreviatedTitles": [],
      "averageRating": "76.85",
      "ratingFrequencies": {
          "2": "414",
          "3": "8",
          "4": "408",
          "5": "10",
          "6": "584",
          "7": "33",
          "8": "1953",
          "9": "33",
          "10": "2484",
          "11": "59",
          "12": "5147",
          "13": "195",
          "14": "10181",
          "15": "381",
          "16": "8619",
          "17": "446",
          "18": "5283",
          "19": "237",
          "20": "11612"
      },
      "userCount": 72842,
      "favoritesCount": 1889,
      "startDate": "2004-10-05",
      "endDate": "2012-03-27",
      "nextRelease": null,
      "popularityRank": 84,
      "ratingRank": 1335,
      "ageRating": "PG",
      "ageRatingGuide": "Teens 13 or older",
      "subtype": "TV",
      "status": "finished",
      "tba": null,
      "posterImage": {
          "tiny": "https://placehold.co/45x64",
          "large": "https://placehold.co/45x64",
          "small": "https://placehold.co/45x64",
          "medium": "https://placehold.co/45x64",
          "original": "https://placehold.co/45x64",
          "meta": {
              "dimensions": {
                  "tiny": {
                      "width": 110,
                      "height": 156
                  },
                  "large": {
                      "width": 550,
                      "height": 780
                  },
                  "small": {
                      "width": 284,
                      "height": 402
                  },
                  "medium": {
                      "width": 390,
                      "height": 554
                  }
              }
          }
      },
      "coverImage": {
          "tiny": "https://placehold.co/45x64",
          "large": "https://placehold.co/45x64",
          "small": "https://placehold.co/45x64",
          "original": "https://placehold.co/45x64",
          "meta": {
              "dimensions": {
                  "tiny": {
                      "width": 840,
                      "height": 200
                  },
                  "large": {
                      "width": 3360,
                      "height": 800
                  },
                  "small": {
                      "width": 1680,
                      "height": 400
                  }
              }
          }
      },
      "episodeCount": 366,
      "episodeLength": 24,
      "totalLength": 8784,
      "youtubeVideoId": "WhyJBof3kXw",
      "showType": "TV",
      "nsfw": false
  },
  "rank": 1,
  "stars": 0,
  "isWatched": true,
  "seasonYear": 2004,
  "watchlist": false
}

const RankedListDecorator: Decorator = (Story, context) => {
  const [state, setState] = useState<Anime[]>(Array(6).fill(fakeAnime).map((anime, index) => (
    {
      ...anime,
      id: index + 1,
      attributes: {
        ...anime.attributes,
        titles: {
          ...anime.attributes.titles,
          en_jp: `${anime.attributes.titles['en_jp']}-index${index}`
        }
      },
      rank: index + 1,
    }
  )));

  const value = { rankedAnimeList: state }

  return (
    <RankedListProvider value={value}>
      <Story />
    </RankedListProvider>
  )
}

export default RankedListDecorator;