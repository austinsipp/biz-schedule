function uniqueDates(Date, index) {
    return Date.indexOf(Date) === index
  }


  const responseArray = [{"shift_id":1,"user_id":2,"first_name":"austin","last_name":"sipp","start_shift":"2023-09-04T19:16:12.592Z","end_shift":"2023-09-04T22:16:12.592Z","location":"main office"},{"shift_id":2,"user_id":2,"first_name":"austin","last_name":"sipp","start_shift":"2023-09-05T19:22:03.005Z","end_shift":"2023-09-05T22:22:03.005Z","location":"main office"}]

  console.log(uniqueDates(responseArray.map(item => item.start_shift.substring(0,11))))