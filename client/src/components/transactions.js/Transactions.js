import React, { useEffect, useState } from 'react';
import Header from '../common/Header'
import API from '../../api/api';
import {Container,Row,Col,Card,Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import { getWallet1 } from "../../redux/actions/action";
import Sidebar from '../common/Sidebar';
import Swal from 'sweetalert2'
import Footer from '../common/Footer';
import api from '../../api/api';
import LoadingOverlay from 'react-loading-overlay';
import jwt_decode from "jwt-decode";
const Wallet = ({
    getOrders,
    history,
    wallet1,
    wallet1Loaded,
    userProfile,
    isAuthenticated
}) =>{
    const [walletData, setWalletData] = useState([]);
    const [walletTableData,setWalletTableData] = useState([])
    const [balance,setBalance] = useState(0)
    const [products,setProducts] = useState([])
    const [isLoaded,setisLoaded] = useState(false)
    const [rowCredit,setRowCredit] = useState(0)
    const[rowDebit,setRowDebit] = useState(0)
    const [prevBalance,setPrevBalance] = useState(0)
    const [currencies,setCurrencies] = useState([])
    const [selectedCurrency,setSelectedCurrency] = useState("")
    const[loadingData,setLoadingData] = useState(true)
    const [selectedUserId,setSelectedUserId] = useState("")
    
    useEffect(()=>{
        if(isAuthenticated && !isLoaded){
           
         var tok = localStorage.getItem("jwtToken");
         const decoded = jwt_decode(tok);
         if(decoded.emailVerified){
             var userInfo={userId:decoded.id}
             getWallet1(userInfo)
             setisLoaded(true)
         }
        }
     },[wallet1Loaded,isAuthenticated])
     useEffect(()=>{
        var tok = localStorage.getItem("jwtToken");
        const decoded = jwt_decode(tok);
        setSelectedUserId(decoded.id)
         loadCurrencies()
        loadData()
      
     },[])

     useEffect(()=>{
         
         loadData()
     },[selectedCurrency,selectedUserId])

     function loadCurrencies(){
        setLoadingData(true)
        console.log("Fetching Currencies ")
        API.getCurrencies().then((response)=>{
            console.log("Currecneis response",response.data.data)
            setCurrencies(response.data.data)
            setLoadingData(false)
        })
     }
     function loadData(){
        setisLoaded(false)
        setLoadingData(true)
        var tok = localStorage.getItem("jwtToken");
        const decoded = jwt_decode(tok);
        var userInfo={userId:selectedUserId}
        console.log("Currencyt Updated ")
         if(selectedCurrency!="")
         {
             console.log("Currencyt Updated ")
            userInfo.currencyId = selectedCurrency
         }
       api.getWallet(userInfo).then((response)=>{
           var tempTableData = []
           console.log("Balance Sheet Data ",response)
           var rowBalance = 0
           var prevBalance = 0
           var rowCredit= 0
           var rowDebit = 0
           var credit = 0
           var debit = 0
           response.data.result.map((entry,index)=>{
              
               prevBalance+= entry.credit - entry.debit
               tempTableData.push({
                   _id:entry._id,
                   credit:entry.credit,
                   debit:entry.debit,
                   rowBalance:prevBalance,
                   currencyId:entry.currencyId,
                   description:entry.description,
                   userId:entry.userId
               })
                credit+=entry.credit
                debit+=entry.debit
                //alert(prevBalance)
           })
        var balance = credit - debit
        setWalletTableData(tempTableData)
        setBalance(balance)
        setWalletData(response.data)
        setLoadingData(false)
      
        setisLoaded(true)
       })
       .catch((error)=>{
           console.log(error)
       })
     }
     function loadUserTransactions(){

     }
     function addBalance(){
         var curr = currencies.map((currency,index)=>{
             return '<option value='+currency._id+'>'+currency.currency+ '( ' +currency.symbol+ ' ) </option>'
         })
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Enter Amount ! ',
            icon: 'info',
            html:'<select class="form-select" id="currencyId"><option disbaled selected >--Choose Wallet --</option>'+curr+'</select><br/><input placeholder="Enter Amount " class="form-control" type="number" id="amount" />',
            showCancelButton: true,
            confirmButtonText: 'Confirm  ',
            cancelButtonText: 'Cancel ',
            reverseButtons: false,
            preConfirm: () => {
                return [
                  document.getElementById('currencyId').value,
                  document.getElementById('amount').value,
                ]
              }
          }).then((result) => {
          
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Processing ! ',
                    html: 'Adding Balance to Wallet  , Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  });
                var user={
                    currencyId:result.value[0],
                    userId:userProfile.id,
                    amount:result.value[1]
                }
                setLoadingData(true)
                API.addBalance(user)
                .then((response)=>{
                    setLoadingData(false)
                  loadData()
                    swalWithBootstrapButtons.fire(
                        'Success !',
                        'Balance Added to Wallet  Successfully !  ',
                        'success'
                      )
                })
                .catch((err)=>{
                    swalWithBootstrapButtons.fire(
                        'Failed ! ',
                       err.message,
                        'error'
                      )
                })
            } 
          })
    }
    return (<>

    {/* <Header/> */}
    <Sidebar/>
      
    <div id="main">
        <header className="mb-3">
            <a href="#" className="burger-btn d-block d-xl-none">
                <i className="bi bi-justify fs-3"></i>
            </a>
        </header>
<div className="page-heading">
<h3>Wallet Details </h3>
</div>
<hr/>
<LoadingOverlay
  active={loadingData}
  spinner
  text='Fetching  Data . . . '
  >
<div className="page-content">
    <section className="row">
        <div className='col-12'>
            <div className='card'>
            <h5 style={{textAlign:'left',margin:'10px'}}> <select style={{width:'300px',float:'left'}} onChange={(e)=>{ setSelectedCurrency(e.target.value) ;}} class="form-select" id="basicSelect">
            <option value="">----- All Wallets ----- </option>
          {currencies.map((curr,index)=>{
              return(
                  <option  value={curr._id}>{curr.currency} ( {curr.symbol} )</option>
              )
          })}
        </select> 
        {userProfile.type=="admin" && userProfile.id != selectedUserId ? <button style={{marginLeft:'10px',cursor:'normal'}} type="button" class="btn btn-primary">
                                {selectedUserId} <span style={{cursor:'pointer'}} onClick={()=>setSelectedUserId(userProfile.id)} class="badge bg-transparent">X </span>
                            </button> :""}
        {userProfile?.type =="customer" ? <button style={{float:"right"}} className="btn btn-primary btn-sm" onClick={()=>addBalance()}>Add Balance </button> : ""}
        </h5>
          
           
            </div>
        </div>
        
        <div className="col-12 col-lg-12">
            <div className="row">
            <div class="card">
                <br/>
           
           
            <div class="table-responsive">
                <table class="table table-lg">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            {userProfile.type == "admin" ? <th>User ID</th> : ""}
                            
                            <th>Description</th>
                            <th>Wallet </th>
                            <th>Debit</th>
                            <th>Credit</th>
                           {selectedCurrency != "" ? <th>Balance </th> : ""} 
                         
                        </tr>
                    </thead>
                    <tbody>
                        {
                        
                        isLoaded ? walletTableData?.reverse().map((entry,index)=>{ 
                            var rowBalance = 0
                            var rowCredit = 0
                            var rowDebit = 0
                            rowCredit+= entry.credit
                            rowDebit+= entry.debit
                            rowBalance = rowCredit - rowDebit
                 
                            return (
                            <tr key={index}>
                                 <td className="text-bold-500">{entry._id}</td>
                                 {userProfile.type == "admin" ? <td onClick={()=> setSelectedUserId(entry.userId)} style={{cursor:'pointer',textDecoration:'underline'}} className="text-bold-500"><b>{entry.userId}</b></td>: ""}
                                 <td>{entry.description}</td>
                                 <td> {currencies.find(e=>e._id == entry.currencyId)?.currency} </td>
                                 

                                 <td className="text-bold-500"> {entry.debit != null ? <span class="badge bg-light-danger">{currencies.find(e=>e._id == entry.currencyId)?.symbol} {entry.debit}</span> : " - "}</td>
                                 <td className="text-bold-500"> {entry.credit != null ? <span class="badge bg-light-success"> {currencies.find(e=>e._id == entry.currencyId)?.symbol} {entry.credit}</span> : " - "}</td>
                                 {selectedCurrency != "" ? <th>{entry.rowBalance} </th> : ""} 
                            
                            
                              
                               
                            </tr>
                        )}):""
                        }
                        
                    </tbody>
                </table>
             </div>
</div>
            </div>
            
           
        </div>

    </section>

   
</div>
</LoadingOverlay>
<Footer/>
           
</div>
          
      
      
        </>
    )
}
const mapDispatchToProps = {
    getWallet1: getWallet1,
};
const mapStateToProps = (state) => ({
    wallet1:state.userReducer.wallet1,
    wallet1Loaded:state.userReducer.isWallet1Loaded,
    userProfile:state.userReducer.user,
    isAuthenticated:state.userReducer.isAuthenticated
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
