// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {

    address payable owner;
    constructor(){
        owner = payable(msg.sender);
    }

    struct Candidate{
        address candidateAddress;
        string candidateName;
    }
    struct Voter{
        address candidateAddress;
        address userAddress;
        string username;
    }
    Candidate[] candidateArray;
    Voter[] voterArray;
    mapping(address => uint) public voteCount;
    mapping(address => bool) public isVoted;
    mapping(address => bool) public isCandidate;
    uint public totalVoteCount;

    function addCandidate(address _candidateAddress, string calldata _candidateName) public {
        require(msg.sender == _candidateAddress, "You can't add other candidate");
        require(!isCandidate[_candidateAddress], "You have already added");
        candidateArray.push(Candidate(_candidateAddress, _candidateName));
        isCandidate[_candidateAddress] = true;
    }

    function addVote(address _candidateAddress, address _userAddress, string calldata _username) public {
        require(!isVoted[_userAddress], "You have already voted");
        isVoted[_userAddress] = true;
        voteCount[_candidateAddress] += 1;
        totalVoteCount += 1;
        voterArray.push(Voter(_candidateAddress, _userAddress, _username));
    }

    function showCandidate() public view returns(Candidate[] memory){
        return candidateArray;
    }
    function showVoter() public view returns(Voter[] memory){
        return voterArray;
    }
    function showIndividualVoteCount(address _candidateAddress) public view returns(uint){
        return voteCount[_candidateAddress];
    }
    function showTotalVoteCount() public view returns(uint){
        return totalVoteCount;
    }

}