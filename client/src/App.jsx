import { useEffect, useState } from 'react'
import abi from "./contractJSON/voting.json"
import { ethers, BigNumber } from 'ethers'

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  })
  const contractAddress = "0xf7D9AF3fd13840f5835d5C2705268059757520DC"
  const [account, setAccount] = useState("Not connected")
  const [addCandidateData, setAddCandidateData] = useState({
    candidateAddress: "",
    candidateName: ""
  })
  const [addVoteData, setAddVoteData] = useState({
    candidateAddress: "",
    userAddress: "",
    username: "",
  })  
  const [allCandidates, setAllCandidates] = useState([]);

  useEffect(()=>{
    const contractABI = abi.abi
    const writeSmartContract = async () => { 
      const { ethereum } = window
      const account = await ethereum.request({ method: "eth_requestAccounts"})
      window.ethereum.on('accountsChanged', () => {
        window.location.reload()
      })
      setAccount(account)
      setAddVoteData({ ...addVoteData, userAddress: account[0] });

      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      setState({provider, signer, contract})
    }
    writeSmartContract()
  }, [])

  useEffect(() => {
    if (state.contract) {
      showCandidate(); // Call showCandidate only when state.contract is defined
    }
  }, [state.contract]);

  const addVote = async (e) => {
    const {contract} = state;
    console.log("clicked1");
    console.log(addVoteData);
    const addVoteMethod = await contract.addVote(addVoteData.candidateAddress, addVoteData.userAddress, addVoteData.username)
    await addVoteMethod.wait();
    alert("Your vote is added successfully");
  }

  const addCandidate = async (e) => {
    const {contract} = state;
    console.log("clicked2");
    const addCandidateMethod = await contract.addCandidate(addVoteData.userAddress, addCandidateData.candidateName)
    await addCandidateMethod.wait();
    alert("Candidate has added successfully");
    window.location.reload()
  }

  const showCandidate = async (e) => {
    const { contract } = state;
    const showCandidateMethod = await contract.showCandidate();
    setAllCandidates(showCandidateMethod);
  }
  
  const showIndividualVoteCount = async (candidateAddress) => {
    try {
      if (candidateAddress && ethers.utils.isAddress(candidateAddress)) {
        const { contract } = state;
        const showIndividualVoteCountMethod = await contract.showIndividualVoteCount(candidateAddress);
        const bigNumber = BigNumber.from(showIndividualVoteCountMethod);
        const numberValue = Number(bigNumber);
        return numberValue;
      } else {
        console.error("Invalid candidate address:", candidateAddress);
      }
    } catch (error) {
      console.error("Error in showIndividualVoteCount:", error);
      throw error; // Re-throw the error to be handled at the caller.
    }
  }
  

  const connect = async() => {
    if(account === "Not connected"){
      const { ethereum } = window
      const account = await ethereum.request({ method: "eth_requestAccounts"})
      window.ethereum.on('accountsChanged', () => {
        window.location.reload()
      })
      setAccount(account)
      setAddVoteData({ ...addVoteData, userAddress: account[0] });
    }
  }

  return (
    <div className=' my-36 mx-60 bg-stone-50 p-20 rounded-lg'>
      <div className=' flex items-center justify-between'>
        {
          account === "Not connected" ? 
          <button onClick={()=>connect()} className=' bg-slate-800 text-slate-50 rounded py-1 px-4 font-medium border border-stone-800'>Connect</button>
          : <h1 className=' font-semibold text-stone-700'><span className=' font-bold text-stone-800 text-xl'>Account: </span>{account}</h1>
        }      
      </div>

      <div className=' my-12 flex items-center justify-center gap-5'>
        {
          allCandidates !=[] && allCandidates.map((candidate, index)=>{
            return ( 
            <div key={index} className=' w-fit border border-stone-400 rounded py-4 px-8'>
              <h1 className=' font-semibold text-stone-700'>{candidate.candidateAddress}</h1>
              <h2 className=' font-semibold text-stone-600'>{candidate.candidateName}</h2>
              <h3 className=' font-semibold text-stone-500'>Vote Count: {showIndividualVoteCount(candidate.candidateAddress)} </h3>
            </div>
          )
          })
        }
      </div>

      <div className=' flex justify-center items-center gap-20'>
        <div className=' flex flex-col gap-3 items-start'>
          <h1 className=' font-bold text-2xl text-stone-800'>Add Your Vote</h1>
          {/* <input onChange={(e)=>setAddVoteData({ ...addVoteData, [e.target.name]: e.target.value })} name='copy and paste the candidateAddress' type="text" placeholder='Candidate Address' className=' border border-stone-400 py-1 px-2 rounded w-96 focus:outline-none'/> */}
          <select value={addVoteData.candidateAddress} onChange={(e)=>setAddVoteData({ ...addVoteData, candidateAddress: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            <option value={""}>Choose a Candidate</option>
            {
              allCandidates !=[] && allCandidates.map((candidate, index)=>{
                return ( 
                  <option key={index} value={candidate.candidateAddress}>{candidate.candidateName}</option>
                )
              })
            }
          </select>

          <input onChange={(e)=>setAddVoteData({ ...addVoteData, [e.target.name]: e.target.value })} name='username' type="name" placeholder='Your Name' className=' border border-stone-400 py-1 px-2 rounded w-96 focus:outline-none' required/>
          <button onClick={()=>addVote()} className=' bg-slate-800 text-slate-50 rounded py-1 px-4 font-medium border border-stone-800'>Add Vote</button>
        </div>

        <div className=' flex flex-col gap-3 items-start'>
          <h1 className=' font-bold text-2xl text-stone-800'>Add a Candidate</h1>
          <input value={addVoteData.userAddress} name="candidateAddress" type="text" className=' border border-stone-400 py-1 px-2 rounded w-96 focus:outline-none' readOnly/>
          <input onChange={(e)=>setAddCandidateData({ ...addCandidateData, [e.target.name]: e.target.value })} name='candidateName' type="name" placeholder='Candidate Name' className=' border border-stone-400 py-1 px-2 rounded w-96 focus:outline-none' required/>
          <button onClick={()=> addCandidate()} className=' bg-slate-800 text-slate-50 rounded py-1 px-4 font-medium border border-stone-800'>Add me as a Candidate</button>
        </div>
      </div>

    </div>
  )
}

export default App
