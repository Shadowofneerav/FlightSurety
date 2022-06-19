import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
        this.flightSuretyApp.options.gas = 200000;
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];

            let counter = 1;
            
            while(this.airlines.length < 4) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    registerFlight(flight,flightname,callback){
        let self=this;
        self.flightSuretyApp.methods.registerFlight(flight,flightname).send({from:self.owner},(error,result) =>{
            callback(error,result);
        });
    }

    fetchregisteredflight_info(callback){
        let self=this;
        self.flightSuretyApp.methods.fetchregisteredflight_info().call({from:self.owner},callback);
    }
   /* isAirline(flight,callback){
        let self=this;
        self.flightSuretyApp.methods
            .isAirline(flight)
            .call({from: self.owner}, callback);
    }*/
    fundbyairline(flightaddress,callback){
        let self=this;
       // console.log(val);
        self.flightSuretyApp.methods.fundbyairline().send({from:flightaddress,value: self.web3.utils.toWei('10',"ether"),gasLimit:200000}, (error, result) => {
            callback(error, result);
        });
    }
    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }
    buy(flightaddress,fees,passenger_address, callback){
        let self=this;
        self.flightSuretyApp.methods.buy(flightaddress).send({from:passenger_address,value: self.web3.utils.toWei('1',"ether"),gasLimit:200000}, (error, result) => {
            callback(error, result);
        });
    }   
    withdraw(passenger_address,callback){
        let self=this;
        self.flightSuretyApp.methods.withdraw(passenger_address).send({from:passenger_address,gasLimit:200000}, (error, result) => {
            callback(error, result);
        });
    }
    add_passenger(callback){
        let self=this;
        console.log("hey");
        self.flightSuretyApp.methods.add_passenger(this.passengers[0],"A").send((error,result)=>{
            callback(error,result);
        });
        console.log("hey1");
        self.flightSuretyApp.methods.add_passenger(this.passengers[1],"B").send((error,result)=>{
            callback(error,result);
        });
        console.log("hey2");
        self.flightSuretyApp.methods.add_passenger(this.passengers[2],"C").send((error,result)=>{
            callback(error,result);
        });
        console.log("hey3");
        self.flightSuretyApp.methods.add_passenger(this.passengers[3],"D").send((error,result)=>{
            callback(error,result);
        });
        console.log("hey4");
        /*self.flightSuretyApp.methods.add_passenger(this.passengers[4],"D").send((error,result)=>{
            callback(error,result);
        });
        console.log("hey5");*/
        return this.passengers;
    }
    getpassengers(callback){
        return this.passengers;
    }
   
}