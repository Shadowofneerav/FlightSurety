
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;
    let flightdetail=[];
    let passengersdetail=[];
    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ],'display-wrapper');
        });
       /* contract.add_passenger((error,result)=>{
            console.log(error,result);
        });*/
      /*  let newdetails=contract.getpassengers((error,result)=>{

        })*/
       // console.log(newdetails);
       contract.fetchregisteredflight_info((error,result)=>{
            console.log(error,result);
            add_in_dropdown(result);
        });
        passengersdetail=contract.add_passenger((error,result)=>{
           // alert("Hi the passengers are added in the list");
           //passengersdetail=result;
           
        });
        
        fillpassenger(passengersdetail);
        fillwithdrawpassenger(passengersdetail);
        console.log(passengersdetail);
        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ],'display-wrapper');
            });
        })

        DOM.elid('register-flight').addEventListener('click', () => {
            let flight = DOM.elid('flight-address').value;
            let flightname=DOM.elid('flight-name').value;
            // Write transaction
            contract.registerFlight(flight,flightname, (error, result) => {
                //display('Flights', 'Registered Flight', [ { label: 'Register the flight', error: error, value: result} ],'display-registration');
                console.log(result);
                console.log(error);
                if(error==null)
                {
                    flightdetail.push(flight);
                    addtodropdown(flight,"arr");
                    addtodropdown(flight,"arr-1");
                    alert("Flight has been registered successfully");
                    
                }
                else{
                   alert("Unable to register the flight");
                }
                console.log(flightdetail);
                
            });
           // console.log("Registration success");
        })
        
        DOM.elid('submit-funds').addEventListener('click', () => {
            let flight = DOM.elid('arr').value;
            let fundingamount=DOM.elid('flight-funds').value;
            // Write transaction
            console.log(flight);
            contract.fundbyairline(flight, (error, result) => {
                //display('Flights', 'funded', [ { label: 'Register the flight', error: error, value: result} ],'display-registration');
                alert("Flight has been successfully funded :" + result + " "+ error);
                console.log(result);
                console.log("Registration success1");
            });
           // console.log("Registration success");
        })
        
        DOM.elid('submit-insurance').addEventListener('click', () => {
           // let flight = DOM.elid('arr').value;
            let fundingamount=DOM.elid('passengers-funds').innerText;
          //  console.log(fundingamount);
            let flightaddress=DOM.elid('arr-1').value;
            console.log(flightaddress);
            let passengeraddress=DOM.elid('arr_passenger').value;
            console.log(passengeraddress);

            // Write transaction
            //console.log(flight);
            contract.buy(flightaddress,fundingamount,passengeraddress, (error, result) => {
                //display('Flights', 'funded', [ { label: 'Register the flight', error: error, value: result} ],'display-registration');
                alert("Insurance has successfully been bought :" + result + " "+ error);
                console.log(result);
                console.log("Registration success1");
            });
           // console.log("Registration success");
        })

        DOM.elid('withdraw-funds').addEventListener('click', () => {
            let passenger_address=DOM.elid('arr_passenger1').value;
            contract.withdraw(passenger_address, (error, result) => {
                //display('Flights', 'funded', [ { label: 'Register the flight', error: error, value: result} ],'display-registration');
                alert("Insurance has successfully been withdrawn :" + result + " "+ error);
                console.log(result);
                console.log("Registration success1");
            });
        });
        
    });
    

})();

function fillpassenger(passenger)
        {
            for(var i=0;i<passenger.length;i++)
            {
            var select=document.getElementById("arr_passenger");
            var el = document.createElement("option");
    el.textContent = passenger[i];
                el.value = passenger[i];
    select.appendChild(el);
            }
        }
        function fillwithdrawpassenger(passenger)
        {
            for(var i=0;i<passenger.length;i++)
            {
            var select=document.getElementById("arr_passenger1");
            var el = document.createElement("option");
    el.textContent = passenger[i];
                el.value = passenger[i];
    select.appendChild(el);
            }
        }
function add_in_dropdown(items,id){
    var select = document.getElementById(id);
    console.log(document.getElementsByTagName("select"));
    var el = document.createElement("option");
    el.textContent = items;
                el.value = items;
    select.appendChild(el);
}
function display(title, description, results,element) {
    let displayDiv = DOM.elid(element);
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}



function addtodropdown(details,id)
{
    var select = document.getElementById(id);
    var el = document.createElement("option");
    el.textContent = details;
                el.value = details;
    select.appendChild(el);


}



