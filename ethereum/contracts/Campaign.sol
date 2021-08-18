// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

struct Request {
    string description;
    uint256 value;
    address payable recipient;
    bool complete;
    uint256 approvalCount;
    mapping(address => bool) approvals;
}

struct CampaignSummary {
    address contractAddress;
    string title;
    string description;
    address manager;
    uint256 minimumContribution;
}

contract CampaignFactory {
    CampaignSummary[] public deployedCampaigns;

    function createCampaign(
        string calldata title,
        string calldata description,
        address manager,
        uint256 minimumContribution
    ) external {
        address newCampaign = address(
            new Campaign(minimumContribution, msg.sender)
        );
        CampaignSummary memory newCampaignSummary = CampaignSummary({
            contractAddress: newCampaign,
            title: title,
            description: description,
            manager: manager,
            minimumContribution: minimumContribution
        });

        deployedCampaigns.push(newCampaignSummary);
    }

    function getDeployedCampaigns()
        public
        view
        returns (CampaignSummary[] memory)
    {
        return deployedCampaigns;
    }
}

contract Campaign {
    mapping(uint256 => Request) public requests;
    uint256 private currentIndex;

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager, "Only manager can call this");
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() external payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string calldata _descripton,
        uint256 _value,
        address payable _recipient
    ) external restricted {
        Request storage newRequest = requests[currentIndex];
        newRequest.description = _descripton;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        currentIndex++;
    }

    function approveRequest(uint256 index) external {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Only a doner approve the request");
        require(
            !request.approvals[msg.sender],
            "You are already approve the request"
        );

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) external restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            currentIndex,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return currentIndex;
    }
}
