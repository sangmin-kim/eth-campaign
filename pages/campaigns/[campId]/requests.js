import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

export const getServerSideProps = async ({ params }) => {
    const campId = params.campId;
    const campaign = Campaign(campId);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element, index) => {
            return campaign.methods.requests(index).call();
        })
    );

    return {
        props: { campId, requestCount, requests: JSON.parse(JSON.stringify(requests)), approversCount }
    }
}

const Requests = ({ campId, requests, approversCount, requestCount }) => {

    const { Header, Row, HeaderCell, Body } = Table;

    const renderRows = () => {
        return requests.map((request, index) => {
            return <RequestRow 
                key={index}
                id={index}
                request={request}
                address={campId}
                approversCount={approversCount}
            />;
        })
    }

    return (
        <>
            <h3>Requests</h3>
            <Link href={`/campaigns/${campId}/requests/new`}>
                <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
            </Link>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>{renderRows()}</Body>
            </Table>
            <div>Found {requestCount} requests.</div>
        </>
    )
}

export default Requests;
