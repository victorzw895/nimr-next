export const fakeAnime = {
  "id": 0,
  "attributes": {
      "description": "Ichigo Kurosaki is an ordinary high schooler—until his family is attacked by a Hollow, a corrupt spirit that seeks to devour human souls. It is then that he meets a Soul Reaper named Rukia Kuchiki, who gets injured while protecting Ichigo's family from the assailant. To save his family, Ichigo accepts Rukia's offer of taking her powers and becomes a Soul Reaper as a result.\nHowever, as Rukia is unable to regain her powers, Ichigo is given the daunting task of hunting down the Hollows that plague their town. However, he is not alone in his fight, as he is later joined by his friends—classmates Orihime Inoue, Yasutora Sado, and Uryuu Ishida—who each have their own unique abilities. As Ichigo and his comrades get used to their new duties and support each other on and off the battlefield, the young Soul Reaper soon learns that the Hollows are not the only real threat to the human world.\n[Written by MAL Rewrite]",
      "titles": {
          "en": "Anime",
          "en_jp": "ANIME",
          "ja_jp": "ANIME"
      },
      "startDate": "2004-10-05",
      "endDate": "2012-03-27",
      "ageRating": "PG",
      "ageRatingGuide": "Teens 13 or older",
      "posterImage": {
          "tiny": "https://placehold.co/45x64",
          "large": "https://placehold.co/45x64",
          "small": "https://placehold.co/45x64",
          "medium": "https://placehold.co/45x64",
          "original": "https://placehold.co/45x64",
      },
      "coverImage": {
          "tiny": "https://placehold.co/45x64",
          "large": "https://placehold.co/45x64",
          "small": "https://placehold.co/45x64",
          "original": "https://placehold.co/45x64",
      },
  },
  "rank": 1,
  "stars": 0,
  "isWatched": true,
  "seasonYear": 2004,
  "watchlist": false
}

export const generateFakeList = (number: number = 6) => {
  return Array(number).fill(fakeAnime).map((anime, index) => (
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
  ))
}