
const config = require("config")
const fs = require("fs")
const raw_repo = require("./raw-repo")
const axios = require("axios")
const scale = config.get("scale")

//reset db function
  const delete_and_reset_all_tables = async () => {
    
     try{
    const res = await raw_repo.getRawResult(`call sp_delete_and_reset_db()`);
  } 
  catch  (err) {

    console.log("received error: ", err.message);
  }
  } //DONE

  //insert countries function
  const countriesInsert = async () => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/all`);
        for (let i = 0; i < response.data.length; i++) {
            try {
                let country_name = response.data[i].name;
                const result = await raw_repo.getRawResult(`select * from sp_insert_country('${country_name}');`);
                if (i == (response.data.length - 1)) {
                    console.log("Number of added items = ", result.rows[0].sp_insert_country, " countries");
                }
            } catch (err) {
            }
        };
        console.log("insert country name to countries table successed. ");
    } catch (err) {
        console.log(" Countries insert - received error: ", err.message);

    };
}; //DONE

//insert user and customers function
const insert_user_and_customer = async() => {
      try{  
        const response = await 
        axios.get("https://random-data-api.com/api/users/random_user?size=20");

        for (let i = 0 ; i <10 ; i++) {
            try {

          const res = await raw_repo.getRawResult(`select * from sp_insert_user_and_customer(
                '${response.data[i].username}',
                '${response.data[i].password}',
                '${response.data[i].email}',
                '${response.data[i].first_name}' ,
                '${response.data[i].last_name}',
                '${response.data[i].address.city}',
                '${response.data[i].phone_number}',
                '${response.data[i].credit_card.cc_number}')`);
        }
        catch (err) {
    }
  };
  console.log("insert users and customers name to tables successed. ");
} catch (err) {console,log("received error: ", err.message)} 
}
//DONE

//insert airlines function
const insert_airlines = async () => {
  try{
let string_from_file = fs.readFileSync('./data/airlines.json', {encoding:'utf8', flag:'r'});
data = JSON.parse(string_from_file);
for(let i =0; i < scale.airlines ; i++)
{

    try {
    const res = await raw_repo.getRawResult(`select * from sp_insert_airlines('${data[i].name}',${Math.floor(Math.random() * 248) + 1},${i + 1});`)
        }
        catch (err) {}};
        console.log("insert airline to airlines table successed. ")
      } catch (err) {
        console.log("received error: ", err.message);
    }
  }
 //DONE

 //insert flights function
 let now = new Date(); 
 let isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toUTCString();
 let isoDatePlus3hours = new Date((now.getTime())+(1000 * 60 *60 *48)- now.getTimezoneOffset() * 60000).toUTCString();

 const insert_flights = async () => {
   try {
    for (let i = 0; i < scale.airlines; i++) {
      let flightsResult;
      for (let j = 0; j < (Math.floor(Math.random() * scale.flights_per_airline) + 1); j++) {

          flightsResult = await raw_repo.getRawResult(`select * from sp_insert_flights(${i+1},${Math.floor(Math.random() * 246) + 1},${Math.floor(Math.random() * 247) + 1},'${isoDate}','${isoDatePlus3hours}',${Math.floor(Math.random() * 250)});`);
      }
      if (i == scale.airlines - 1) {
          console.log("Number of added items = ", flightsResult.rows[0].sp_insert_flights, "flights");
      };
  };
  console.log("insert flight info to flights table successed. ");
} catch (err) {
  console.log("flight insert - received error: ", err.message);
};
}; //DONE

//insert tickets function
const insert_tickets = async () => {
  console.log("inserting tickets...");
  try {
      for (let i = 0; i < scale.customers; i++) {
          const ticketsResult = await raw_repo.getRawResult(`select * from sp_insert_ticket('${i + 1}','${i + 1}');`);
          if (i == scale.customers - 1) {
              console.log("Number of added items = ", ticketsResult.rows[0].sp_insert_ticket, "tickets");
          };
      };
      console.log("insert ticket info to tickets table successed. ");
  } catch (err) {
      console.log("ticket insert - received error: ", err.message);

  };

};


const runAll = async function () {

await delete_and_reset_all_tables();
await countriesInsert();
await insert_user_and_customer();
await insert_airlines();
await insert_flights();
await insert_tickets();
}

runAll();