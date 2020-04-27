export default [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(20118, 3, 10),
    end: new Date(20118, 3, 1),
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(20118, 3, 7),
    end: new Date(20118, 3, 10),
  },

  {
    id: 2,
    title: 'DTS STARTS',
    start: new Date(2016, 2, 13),
    end: new Date(2016, 2, 20),
  },

  {
    id: 3,
    title: 'DTS ENDS',
    start: new Date(2016, 10, 6),
    end: new Date(2016, 10, 13),
  },

  {
    id: 4,
    title: 'Some Event',
    start: new Date(20118, 3, 9),
    end: new Date(20118, 3, 10),
  },
  {
    id: 5,
    title: 'Conference',
    start: new Date(20118, 3, 11),
    end: new Date(20118, 3, 13),
    desc: 'Big conference for important people',
  },
  {
    id: 6,
    title: 'Meeting',
    start: new Date(20118, 3, 12),
    end: new Date(20118, 3, 12),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    id: 7,
    title: 'Lunch',
    start: new Date(20118, 3, 12),
    end: new Date(20118, 3, 12, 13),
    desc: 'Power lunch',
  },
  {
    id: 8,
    title: 'Meeting',
    start: new Date(20118, 3, 12),
    end: new Date(20118, 3, 12),
  },
  {
    id: 9,
    title: 'Happy Hour',
    start: new Date(20118, 3, 12),
    end: new Date(20118, 3, 12),
    desc: 'Most important meal of the day',
  },
  {
    id: 10,
    title: 'Dinner',
    start: new Date(20118, 3, 1 ),
    end: new Date(20118, 3, 12, 21 ),
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(20118, 3, 13 ),
    end: new Date(20118, 3, 13),
  },
  {
    id: 12,
    title: 'Late Night Event',
    start: new Date(20118, 3, 17),
    end: new Date(20118, 3, 18),
  },
  {
    id: 12.5,
    title: 'Late Same Night Event',
    start: new Date(20118, 3, 17),
    end: new Date(20118, 3, 17),
  },
  {
    id: 13,
    title: 'Multi-day Event',
    start: new Date(20118, 3, 20),
    end: new Date(20118, 3, 22),
  },
  {
    id: 14,
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
]