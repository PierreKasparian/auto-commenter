// import React from "react";
// function convertToTimezonePreserveLocalTime(
//   date: Date,
//   targetTimeZone: string
// ) {
//   const parts = {
//     year: date.getFullYear(),
//     month: date.getMonth(),
//     day: date.getDate(),
//     hour: date.getHours(),
//     minute: date.getMinutes(),
//     second: date.getSeconds(),
//     millisecond: date.getMilliseconds(),
//   };

//   // Create the string representation of the date with the same components
//   const formatter = new Intl.DateTimeFormat("en-US", {
//     timeZone: targetTimeZone,
//     hour12: false,
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });

//   const localTimeString = `${String(parts.month + 1).padStart(2, "0")}/${String(
//     parts.day
//   ).padStart(2, "0")}/${parts.year}, ${String(parts.hour).padStart(
//     2,
//     "0"
//   )}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(
//     2,
//     "0"
//   )}`;

//   // Now parse this string **as if** it were in the target timezone
//   const fakeDateInTargetTZ = new Date(
//     new Date(localTimeString).toLocaleString("en-US", {
//       timeZone: targetTimeZone,
//     })
//   );

//   return fakeDateInTargetTZ;
// }
// function makeDateAtSameLocalTimeInTimezone(timeZone: string) {
//   const now = new Date();

//   // Obtenir les composants locaux
//   const formatter = new Intl.DateTimeFormat("en-GB", {
//     timeZone,
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour12: false,
//   });

//   const parts = formatter.formatToParts(now).reduce((acc, part) => {
//     if (part.type !== "literal") acc[part.type] = part.value;
//     return acc;
//   }, {});

//   // Reconstruire une date ISO à partir de ces composants
//   const localTimeString = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;

//   // Interpréter cette date comme UTC (pour éviter les biais de la machine)
//   return new Date(localTimeString);
// }

// function getTimezoneOffsetInMinutes(timeZone: string, date = new Date()) {
//   // Get the timestamp in UTC (milliseconds since epoch)
//   const utcDate = Date.UTC(
//     date.getFullYear(),
//     date.getMonth(),
//     date.getDate(),
//     date.getHours(),
//     date.getMinutes(),
//     date.getSeconds()
//   );
//   //   console.log(utcDate)
//   // Get the same time in the target timezone
//   const formatter = new Intl.DateTimeFormat("en-US", {
//     timeZone,
//     hour12: false,
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });

//   const parts = formatter.formatToParts(date).reduce((acc, part) => {
//     if (part.type !== "literal") acc[part.type] = part.value;
//     return acc;
//   }, {});

//   const targetDate = new Date(
//     `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`
//   );

//   // Difference in minutes between UTC and the target timezone
//   const offsetMs = targetDate.getTime() - date.getTime();
//   return Math.round(offsetMs / 60000); // in minutes
// }
// function getRandomTimeInTimezone(timeZone) {
//   const now = new Date();

//   // Get current date components in the target timezone
//   const formatter = new Intl.DateTimeFormat("en-CA", {
//     timeZone,
//     hour12: false,
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   });

//   const dateParts = formatter.formatToParts(now).reduce((acc, part) => {
//     if (part.type !== "literal") acc[part.type] = part.value;
//     return acc;
//   }, {});

//   const year = dateParts.year;
//   const month = dateParts.month;
//   const day = dateParts.day;

//   // Generate random hour between 8 and 17 (inclusive), minute in multiples of 5
//   const hour = Math.floor(Math.random() * 10) + 8; // 8–17
//   const minute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, ..., 55

//   // Construct ISO string for that time in the given timezone
//   const timeString = `${year}-${month}-${day}T${String(hour).padStart(
//     2,
//     "0"
//   )}:${String(minute).padStart(2, "0")}:00`;

//   // Parse it as if it's in the target timezone
//   const localDateInTZ = new Date(
//     new Date(timeString).toLocaleString("en-US", { timeZone })
//   );

//   return localDateInTZ;
// }
// function getRandomTimestamptzFromUTCWithOffset(timeZone) {
//   const now = new Date();
//   const year = now.getUTCFullYear();
//   const month = now.getUTCMonth(); // 0-based
//   const day = now.getUTCDate();

//   const hour = Math.floor(Math.random() * 10) + 8; // 08–17
//   const minute = Math.floor(Math.random() * 12) * 5; // 0–55
//   console.log(hour, minute);
//   // Create a UTC date for today at the random time
//   const utcDate = new Date(Date.UTC(year, month, day, hour, minute, 0));

//   // Get timezone offset in minutes
//   const offsetMinutes = getTimezoneOffsetInMinutes(timeZone);

//   // Apply offset
//   const shiftedDate = new Date(utcDate.getTime() + offsetMinutes * 60 * 1000);

//   // Return ISO 8601 with 'Z' removed (PostgreSQL parses ISO 8601 correctly with local offset)
//   return shiftedDate.toISOString(); // this is in UTC
// }
// const page = () => {
//   // Fonction pour générer une date avec heure aléatoire entre 8h et 18h
//   // const generateRandomTime = (timezone: string): Date => {
//   //     const today = new Date();
//   //     // Réinitialiser l'heure à minuit
//   //     today.setHours(0, 0, 0, 0);
//   //     // Générer une heure aléatoire entre 8 et 18
//   //     const randomHour = Math.floor(Math.random() * 11) + 8;
//   //     // Générer des minutes aléatoires (multiples de 5)
//   //     const randomMinute = Math.floor(Math.random() * 12) * 5;
//   //     // Définir l'heure et les minutes
//   //     today.setHours(randomHour, randomMinute, 0, 0);
//   //     // Définir le fuseau horaire
//   //     today.toLocaleString('en-US', { timeZone: "Europe/Paris" });
//   //     return today;
//   // };
//   function getRandomInt(min: number, max: number) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }

//   const generateRandomTime = (timezone: string) => {
//     let time = new Date();
//     time.setHours(8);
//     let offsetMinutes = Math.max(getTimezoneOffsetInMinutes(timezone), -8 * 60);

//     const timeofTimezone = time.getTime() + (offsetMinutes * 60 * 1000);
//     // const randomTime = getRandomInt(3, 120) * 5 * 60 * 1000;
//     const randomTime = 0
//     console.log((timeofTimezone + randomTime).toString().slice(0, -5))
//     return (timeofTimezone + randomTime).toString().slice(0, -5);
//   };
 

//   // Générer une date aléatoire pour Paris
//   // const parisTime = convertToTimezonePreserveLocalTime(new Date(), "Europe/Paris");
//   // console.log(parisTime)
//   // console.log(parisTime.getTime().toString().slice(0, -5));
//   // console.log("caca",new Date().toUTCString())
//   // const parisTime2 = makeDateAtSameLocalTimeInTimezone("Europe/Paris");
//   // console.log(parisTime2)
//   // console.log(parisTime2.getTime().toString().slice(0, -5));
//   // console.log(getTimeOffset("America/New_York"))
//   // console.log(getTimezoneOffsetInMinutes("Asia/Shanghai"))
//   // // console.log(getTimezoneOffsetInMinutes("Europe/Paris"))
//   // console.log(getRandomTimeInTimezone("Asia/Shanghai"))
//   // console.log(getRandomTimeInTimezone("Europe/Paris"))
//   // Get timezone offset in minutes

// //   console.log(generateRandomTime("Europe/Paris"))
// //   console.log(cacaisNow("Europe/Paris",generateRandomTime("Europe/Paris")))
//   return <div>page</div>;
// };

// export default page;
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page