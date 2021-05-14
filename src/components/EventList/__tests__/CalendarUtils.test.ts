import { TourmericEvent, TourmericEventEntry } from '../../../models/Events';
import {
  filterEventsByPublishedStatus,
  filterEventsByCategory,
} from '../EventCalendar/CalendarUtils';

const publishedEvent: TourmericEvent = {
  category: 'category1',
  createDate: '123',
  date: '123',
  entryFee: '0',
  name: 'name',
  time: '10:00',
  published: true,
};

const unpublishedEvent: TourmericEvent = {
  category: 'category2',
  createDate: '123',
  date: '123',
  entryFee: '0',
  name: 'name',
  time: '10:00',
  published: false,
};

const publishStatusUndefined: TourmericEvent = {
  category: 'category3',
  createDate: '123',
  date: '123',
  entryFee: '0',
  name: 'name',
  time: '10:00',
};

const publishedCategory2Event: TourmericEvent = {
  category: 'category2',
  createDate: '123',
  date: '123',
  entryFee: '0',
  name: 'name',
  time: '10:00',
  published: true,
};

const publishedCategory3Event: TourmericEvent = {
  category: 'category3',
  createDate: '123',
  date: '123',
  entryFee: '0',
  name: 'name',
  time: '10:00',
  published: true,
};

const publishedEvents: TourmericEventEntry[] = [
  { key: '-123', value: publishedEvent },
  { key: '-456', value: publishedCategory2Event },
  { key: '-789', value: publishedCategory3Event },
];

const publishedAndUnpublishedEvents: TourmericEventEntry[] = [
  { key: '-123', value: publishedEvent },
  { key: '-456', value: unpublishedEvent },
  { key: '-789', value: publishStatusUndefined },
];

describe('CalendarUtils tests published status filter', () => {
  it('Only published events are shown', () => {
    const result = filterEventsByPublishedStatus(publishedAndUnpublishedEvents);
    expect(result).toMatchInlineSnapshot(`
                        Array [
                          Object {
                            "key": "-123",
                            "value": Object {
                              "category": "category1",
                              "createDate": "123",
                              "date": "123",
                              "entryFee": "0",
                              "name": "name",
                              "published": true,
                              "time": "10:00",
                            },
                          },
                        ]
                `);
  });
});

describe('CalendarUtils tests category filter', () => {
  it('Only category1 is shown', () => {
    const result = filterEventsByCategory(publishedEvents, ['category1']);
    expect(result).toMatchInlineSnapshot(`
                  Array [
                    Object {
                      "key": "-123",
                      "value": Object {
                        "category": "category1",
                        "createDate": "123",
                        "date": "123",
                        "entryFee": "0",
                        "name": "name",
                        "published": true,
                        "time": "10:00",
                      },
                    },
                  ]
            `);
  });

  it('Only category2 is shown', () => {
    const result = filterEventsByCategory(publishedEvents, ['category2']);
    expect(result).toMatchInlineSnapshot(`
            Array [
              Object {
                "key": "-456",
                "value": Object {
                  "category": "category2",
                  "createDate": "123",
                  "date": "123",
                  "entryFee": "0",
                  "name": "name",
                  "published": true,
                  "time": "10:00",
                },
              },
            ]
        `);
  });

  it('Both category2 and category3 are shown', () => {
    const result = filterEventsByCategory(publishedEvents, [
      'category2',
      'category3',
    ]);
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "key": "-456",
          "value": Object {
            "category": "category2",
            "createDate": "123",
            "date": "123",
            "entryFee": "0",
            "name": "name",
            "published": true,
            "time": "10:00",
          },
        },
        Object {
          "key": "-789",
          "value": Object {
            "category": "category3",
            "createDate": "123",
            "date": "123",
            "entryFee": "0",
            "name": "name",
            "published": true,
            "time": "10:00",
          },
        },
      ]
    `);
  });
});
