pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

      /*  uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;*/

    mapping(address => uint256) private authorizedContracts;

    struct Flight {
        address airlineaddress;
        bool isRegistered;
        uint8 statusCode;
   //     uint256 updatedTimestamp;               
        bool onQueue;
        uint16 votes;
        mapping (address => mapping (address => bool)) votedairlines;
        //mapping(address=>address) votedairlines;
        string flightname;
        uint256 fundingamount;
        bool isfunded;
    }

    struct Passenger{
        address passenger_address;
        string passenger_name;
        uint256 insurance_amount;
    }

    uint8 private flightsregistered=0;
    mapping(address => Flight) private onQueueflights;
    mapping(address => Flight) private flights;
    mapping(address => Passenger) private passenger_addfunds;
    mapping(address => Passenger) private inflight;
    address[] private registeredflights;
    //mapping(address=> Flight) private 
    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;

        flights[msg.sender].airlineaddress=msg.sender;
        flights[msg.sender].isRegistered=true;
        flights[msg.sender].statusCode=0;
    //    flights[msg.sender].updatedTimestamp=block.timestamp;
        flights[msg.sender].onQueue=false;
        flights[msg.sender].votes=0;
        flights[msg.sender].flightname="Initial Flight";
        flights[msg.sender].fundingamount=0;
        flights[msg.sender].isfunded=false;
        flightsregistered++;
        //registeredflights.push(msg.sender);
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }
    /*modifier requireIsCallerAuthorized()
    {
        require(authorizedContracts[msg.sender] == 1, "Caller is not contract owner");
        _;
    }*/

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }

   function authorizeContract
                            (
                                address contractAddress
                            )
                            external
                            requireContractOwner
    {
        authorizedContracts[contractAddress] = 1;
    }

    function deauthorizeContract
                            (
                                address contractAddress
                            )
                            external
                            requireContractOwner
    {
        delete authorizedContracts[contractAddress];
    }
    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function isQueued(address airlineaddress) external returns(bool) 
    {
        return flights[airlineaddress].onQueue;
    }
    function isRegistered(address airlineaddress) external returns(bool) 
    {
        return flights[airlineaddress].isRegistered;
    }
    function fetchregisteredflight_info() external returns(address[])
    {
        return registeredflights;
    }
    
    //Add the flight on queue for insurance
    function addonqueue(
                                address  airline,                           
                            //    uint256 updatedTimestamp,                               
                                string flightname
                             //   uint256 fundingamount
    ) external  payable
    {
        require(!flights[airline].isRegistered,"Flight is already registered");
        require(!flights[airline].onQueue,"Flight is already on the Queue");
     //   require(msg.value>= 1000000000000000000,"The funding amount should be greater than 10 ether");
        flights[airline].airlineaddress=airline;
        flights[airline].isRegistered=false;
      //  flights[airline].statusCode=STATUS_CODE_UNKNOWN;
       // flights[airline].updatedTimestamp=updatedTimestamp;
        flights[airline].onQueue=true;
        flights[airline].votes=0;
        flights[airline].flightname=flightname;
        flights[airline].fundingamount=0;
       /* flights[airline]= Flight ({
            airlineaddress:airline,
            isRegistered:false,
            statusCode:STATUS_CODE_UNKNOWN,
            updatedTimestamp:updatedTimestamp,
            onQueue:true,
            votes:0,
            flightname:flightname,
            fundingamount:fundingamount
        });*/
    } 

    //Flight's on queue to vote
    function vote(address airline,address fromairline) external
    {
        require(!flights[airline].isRegistered,"Flight is already registered no need to vote");
        require(flights[fromairline].isRegistered,"Registered flights can only vote");
        //require(flight[airline].votes<5,"Already eligible for registration");
        require(!flights[fromairline].votedairlines[airline][fromairline],"This flight has already voted for the flight that you want to register");
        flights[airline].votes++;
        flights[fromairline].votedairlines[airline][fromairline]=true;
    }

    function fetchvotes(address airline) returns(uint16)
    {
        return flights[airline].votes;
    }

    function fetchfundingamount(address airline) external returns(uint256)
    {
        return flights[airline].fundingamount;
    }
    function registerAirline
                            (                  
                                address airline,
                                string flightname                               
                            )
                            external returns(bool)
                            
    {
        require(!flights[airline].isRegistered,"Flight is already registered");
        
       /* flights[id]= Flights({
            id:id;
            statuscode:STATUS_CODE_UNKNOWN;
            updatedTimestamp:updatedTimestamp;
            airline:airline;
            onQ
            flightname:flightname;
        });*/
      //  require(flights[airline].onQueue,"Not entered in Queue yet");
        flights[airline].isRegistered=true;
        flights[airline].flightname=flightname;
        flights[airline].onQueue=false;
        flights[airline].isfunded=false;
        flightsregistered++;
       //registeredflights.push(airline);
        return true;
       
    }
    // to check whether the flight is registered or not 
    function isAirline(address airline) external returns(bool){
        return flights[airline].isRegistered;
    }

    function isFunded(address airline) external returns(bool){
        return flights[airline].isfunded;
    }

    function fetchregisteredflights() external returns(uint8)
    {
        return flightsregistered;
    }
   /**
    * @dev Buy insurance for a flight
    *
    */   
    function add_passenger(address passenger_address,string passenger_name) external
    {
        passenger_addfunds[passenger_address].passenger_address=passenger_address;
        passenger_addfunds[passenger_address].passenger_name=passenger_name;
        passenger_addfunds[passenger_address].insurance_amount=0;

    }
    function buy
                            (             
                                address flightaddress, uint256 fees,address passenger_address             
                            )
                            external
                            payable
    {
        require(flights[flightaddress].isRegistered,"Motherfucker flight is not registered yet");
        require(fees>=1 ether, "Please pay minimum 1 ether to buy flight insurance");
       
        inflight[flightaddress].passenger_address=passenger_address;
        inflight[flightaddress].passenger_name=passenger_addfunds[passenger_address].passenger_name;
        passenger_addfunds[passenger_address].insurance_amount=passenger_addfunds[passenger_address].insurance_amount.add(fees);
        inflight[flightaddress].insurance_amount=fees;
         contractOwner.send(fees);
    }

    /*
        Insuree wants to withdraw funds
    */
    function withdraw(address passenger_address) external payable
    {
        //require(flights[flightaddress].isRegistered,"Motherfucker flight is not registered yet");
        //require(inflight[flightaddress].passenger_address==msg.sender,"You little piece of shit, go buy the insurance of this flight first");
       // require(inflight[flightaddress].insurance_amount>0,"Your insurance amount should be greater than 0 ether motherfucker");
        require(passenger_addfunds[passenger_address].insurance_amount>0 ether,"There is no balance in your wallet");
        uint256 withdraw_amount=passenger_addfunds[passenger_address].insurance_amount;
        passenger_addfunds[passenger_address].insurance_amount=passenger_addfunds[passenger_address].insurance_amount.sub(withdraw_amount);
       
        passenger_address.send(withdraw_amount);
        //inflight[flightaddress].insurance_amount.sub(withdraw_amount);
        
    }

    /*
    Flight is delayed you need pay give my money now
    */

    function delayed(address flightaddress) external payable   
    {
        require(inflight[flightaddress].insurance_amount>1 ether,"You did not made investermet");
        require(inflight[flightaddress].passenger_address==msg.sender,"You little piece of shit, go buy the insurance of this flight first");
        uint256 currentamount=inflight[flightaddress].insurance_amount;
        uint256 amount_to_transfer=inflight[flightaddress].insurance_amount * 2;
        inflight[flightaddress].insurance_amount=amount_to_transfer;
    }
    function givebybackmoney
                            (
                                address flightaddress
                            )
                            external
                            payable
                            {
                                //require(flights[flightaddress].passenger_address=msg.sender,"");
                                 require(inflight[flightaddress].passenger_address==msg.sender,"You little piece of shit, go buy the insurance of this flight first");
                                    require(inflight[flightaddress].insurance_amount>0,"Your insurance amount should be greater than 0 ether motherfucker");

                            }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
        
    }
    
    function delayinflight
    (

    )
    external
    pure{

    }
    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fundbyairline(address airlineaddress,uint256 price) public payable
    {
       require(flights[airlineaddress].isRegistered,"Not registered");
        require(flights[airlineaddress].isRegistered==true,"Flight is not registered yet");
            require(price>=10 ether,"Send more ether motherfucker, you own a flight");
            uint256 current_fundingamount=flights[airlineaddress].fundingamount;
            uint256 new_fundingamount=current_fundingamount.add(price);
            flights[airlineaddress].fundingamount=new_fundingamount;
            if(new_fundingamount>=10 ether)
            {
                //flights[flightaddress].fundingamount=;
                flights[airlineaddress].isfunded=true;
            }
        //flights[flightaddress].fundingamount=funding_value;
       //flightaddress.transferTo(contractOwner, funding_value);
        //contractOwner.transfer(price);
        //(bool success, ) = contractOwner.call.value(price)("");
       //require(success, "Transfer failed.");
         
    }

    function fund
                            (   
                            )
                            public
                            payable
    {
        require(flights[msg.sender].isRegistered,"Not registered");
        //require(flights[msg.sender].isRegistered==true,"Flight is not registered yet");
        require(msg.value>=10 ether,"Send more ether motherfucker, you own a flight");
        flights[msg.sender].fundingamount=msg.value;
        contractOwner.transfer(msg.value);
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                             
                            payable 
                            external
    {
      fund();
    }


}

