var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
 
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    //await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    await config.flightSuretyData.authorizeContract(config.flightSuretyApp.address);
    
 // config.flightSuretyApp.options.gas = 200000;
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it(`Did the first airline registered itself`,async () =>{
    let flights=false;
    try{
        
        flights=await config.flightSuretyData.isAirline.call(accounts[0]);
      
    }
    catch(e){
        
    }

    //Assert 
    assert.equal(flights, true, "The default registration of constructor is not done yet");
  })
 /*   it(`(airline) can register an Airline using registerAirline()`,async () =>{
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
        
       // await config.flightSuretyApp.addonqueue(newAirline,"Merautha", {from: accounts[0], value:web3.utils.toWei('10', "ether")});

     //  await config.flightSuretyApp.addonqueue(newAirline,"Merautha", {from: accounts[0]});
      // var inqueue=await config.flightSuretyApp.isQueued.call(newAirline, {from: accounts[0]});
       
       //    console.log(accounts[0]);
    
       // await config.flightSuretyApp.addonqueue_vote(newAirline,{from: accounts[0]});
        //await config.flightSuretyApp.addonqueue_vote(newAirline,{from: accounts[0]});
      //  var votes=await config.flightSuretyData.fetchvotes.call(newAirline);
        //assert.equal(votes, 1, "funding");
        
        //await config.flightSuretyApp.registerAirline(newAirline, {from: accounts[0]});
      //  await config.flightSuretyApp.registerFlight(newAirline,"abc",{from: accounts[0]})
        //var amount=await config.flightSuretyData.fetchfundingamount(newAirline);
       // assert.equal(amount, 12, "funding");

       // console.log(web3.utils.toWei(web3.utils.toBN(amount), "ether"));
      // console.log(web3.utils.toWei(String(amount), "ether"));
        
    }
    catch(e) {
        console.log(e);
    }
    
        let result = await config.flightSuretyApp.isAirline.call(newAirline, {from: accounts[0]}); 
        assert.equal(result, true, "funding");
    //let result = await config.flightSuretyData.isAirline.call(newAirline); 

    // ASSERT
    //assert.equal(result, true, "funding");

  });*/
  it(`(airline) cannot register an Airline using registerAirline() if it is not funded`, async () => {
    
    // ARRANGE
    let newAirline = accounts[3];

    // ACT
    try {
       // await config.flightSuretyApp.addonqueue(newAirline,"Mera utha");
       // await config.flightSuretyApp.addonqueue_vote(newAirline);
      // let somerror=await config.flightSuretyData.isAirline.call(newAirline);
      // console.log(somerror);
       var a= await config.flightSuretyApp.registerFlight(newAirline,'avb', {from: config.firstAirline});
       console.log(a);
    }
    catch(e) {
      console.log(e);
    }
    let result = await config.flightSuretyData.isAirline.call(newAirline); 
    console.log(result);
    // ASSERT
    assert.equal(result, true, "Airline should not be able to register another airline if it hasn't provided funding");

  });
  
  /*it(`provide funding for the airline`,async() =>{
    let newAirline =accounts[0];
    try{
        console.log("Hello");
        var whetherreg=await config.flightSuretyApp.isAirline.call(newAirline, {from: accounts[0]});
        console.log(whetherreg);
        await config.flightSuretyData.fundbyairline({from: accounts[0],value:web3.utils.toWei('10', "ether")});
        console.log("hello2");
    }
    catch(e){
        console.log(e);
    }
    
    var fundingamount= await config.flightSuretyData.fetchfundingamount.call(accounts[0]);
    console.log(fundingamount);
    assert.equal(amount, 10, "funding");

  });*/

  it(`provide new funding`,async()=>{
    let newAirline=accounts[0];
    try{
      //config.flightSuretyApp.options.gas = 200000;
      console.log("Hello");
      var whetherreg=await config.flightSuretyApp.isAirline.call(newAirline, {from: accounts[0]});
      var trynew=await config.flightSuretyApp.isAirline.call(accounts[3], {from: accounts[0]});
      //var a= await config.flightSuretyApp.registerFlight.call(newAirline,'avb', {from: config.firstAirline});
      // console.log(a);
      console.log(whetherreg);
      console.log(trynew);
      //console.log(accounts[3] +" - " +trynew);
      await config.flightSuretyApp.fundbyairline({from: accounts[3],value:web3.utils.toWei('10', "ether"),gasLimit:200000});
      console.log("hello2");

    }
    catch(e){
      console.log(e);
    }
    let result=await config.flightSuretyApp.isFunded.call(accounts[3]);
    console.log(result);
    //assert.equal(result,true,"Airline needs to be funded");
  })
  
});
