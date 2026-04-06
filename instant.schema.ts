import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    tripLogs: i.entity({
      date: i.string(),
      mood: i.string(),
      moodSub: i.string(),
      moodIndex: i.number(),
      substances: i.json<string[]>(),
      locations: i.json<string[]>(),
      reasons: i.json<string[]>(),
      bodyFeelings: i.json<string[]>(),
      feltGood: i.string(),
      challenging: i.string(),
      learned: i.string(),
      different: i.string(),
      createdAt: i.number(),
    }),
    checklistItems: i.entity({
      text: i.string(),
      checked: i.boolean(),
      createdAt: i.number(),
    }),
    savedDrugs: i.entity({
      drugKey: i.string(),
    }),
  },
});

export default _schema;
