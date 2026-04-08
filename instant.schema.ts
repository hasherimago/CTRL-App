import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      name: i.string().optional(),
      photoUrl: i.string().optional(),
    }),
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
  links: {
    tripLogOwner: {
      forward: { on: 'tripLogs', has: 'one', label: 'owner' },
      reverse: { on: '$users', has: 'many', label: 'userTripLogs' },
    },
    checklistItemOwner: {
      forward: { on: 'checklistItems', has: 'one', label: 'owner' },
      reverse: { on: '$users', has: 'many', label: 'userChecklistItems' },
    },
    savedDrugOwner: {
      forward: { on: 'savedDrugs', has: 'one', label: 'owner' },
      reverse: { on: '$users', has: 'many', label: 'userSavedDrugs' },
    },
  },
});

export default _schema;