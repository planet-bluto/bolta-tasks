// addEventListener("reminder", async (resolve, reject, args) => {
//   let currTime = Date.now()

//   for await (const index of Array.from({ length: 15 })) {
//     let res = await fetch("https://bolta.planet-bluto.net/db/reminding_tasks/" + currTime)
//     let tasks = await res.json()
  
//     if (tasks.length > 0) {
//       console.log(`Scheduled reminders for ${tasks.map(task => task.title).join(", ")}`)
//       CapacitorNotifications.schedule([
//         {
//           id: 100,
//           title: `Reminder for ${tasks.length} task${(tasks.length > 1 ? "s" : "")}`,
//           body: `Reminder${(tasks.length > 1 ? "s" : "")} for ${tasks.map(task => task.title).join(", ")}`,
//           schedule: { at: new Date(currTime+3000) },
//         },
//       ]);
//     } 

//     currTime += 60000
//   }

//   resolve()
// })