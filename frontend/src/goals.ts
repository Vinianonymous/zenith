// Okay so some planning!
// This is meant to hook up with the goals.html file
// There will be a goal list
// Here comes the data type I guess? Not sure, it's 2 AM, and I'm doomcoding
export type goal = {
  name: string;
  desc: string;
  deadline: Date;
  difficulty: number;
};

//So we render a calendar (Month/week) locating each goal in it's attributed deadline. Boom.
// i wonder if there's an dedicated HTML element for calendars?
