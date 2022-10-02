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

    // External functions
    // ...

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
