// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/**
  @title Voting with delegation.
  @notice Purpose of contract is to:  
    - give voting rights, 
    - casting votes, 
    - delegating votes and 
    - querying results
  @dev //TO-DO
 */
contract Ballot {
    /**
      @notice ballot chairperson:
        has ability to give voting rights to another address
      @dev deployer address is chairperson
        - cannot give right to vote to those who already voted
        - cannot give voting rights for someone with rights already
     */
    address public chairperson;

    /**
      @notice keep track of votes received by each ballot option
      @dev solidity structure with two fields:
        - name
        - voteCount
     */
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    /// @dev dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    // This variable is a new complex type (struct) which represents a single voter
    struct Voter {
        uint256 weight; // weight is accumulated by delegation
        bool voted; // if true, that person already voted
        address delegate; // person delegated to
        uint256 vote; // index of the voted proposal
    }

    // Map address to Voter complex type (struct) stores a `Voter` struct for each possible address
    mapping(address => Voter) public voters;

    /**
      @notice sets at deployment the chairperson address, ballot-options (proposals), 
      @dev 
      @param proposalNames bytes32 array of ballot option names
     */
    constructor(bytes32[] memory proposalNames) {
        // assign deployer address as chairperson
        chairperson = msg.sender;

        // set weight of chairperson's vote
        voters[chairperson].weight = 1;

        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint256 i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    receive() external payable {
        // ...
    }

    fallback() external {
        // ...
    }

    /* 
      External functions
     */
    // Give `voter` the right to vote on this ballot.
    // May only be called by `chairperson`.
    function giveRightToVote(address voter) external {
        // If the first argument of `require` evaluates
        // to `false`, execution terminates and all
        // changes to the state and to Ether balances
        // are reverted.
        // This used to consume all gas in old EVM versions, but
        // not anymore.
        // It is often a good idea to use `require` to check if
        // functions are called correctly.
        // As a second argument, you can also provide an
        // explanation about what went wrong.
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint256 proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += sender.weight;
    }

    // External functions that are view
    // ...

    // External functions that are pure
    // ...

    // Public functions
    // ...

    // Internal functions
    // ...

    // Private functions
    // ...
}
