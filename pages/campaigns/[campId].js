import { useEffect, useState } from 'react';
import Link from 'next/link';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';

export const getServerSideProps = async ({ params }) => {
    const campId = params.campId;
    return {
        props: { campId }
    }
}

const CampaignDetail = ({ campId }) => {
    const [minCont, setMinCount] = useState('');
    const [balance, setBalance] = useState('0');
    const [reqCount, setReqCount] = useState(0);
    const [appCount, setAppCount] = useState(0);
    const [manager, setManager] = useState('');

    useEffect(() => {
        const init = async () => {
            const campaign = Campaign(campId);
            const summary = await campaign.methods.getSummary().call();

            setMinCount(summary[0]);
            setBalance(summary[1]);
            setReqCount(summary[2]);
            setAppCount(summary[3]);
            setManager(summary[4]);
        }
        init();
    });

    const renderCards = () => {
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word'}
            },
            {
                header: minCont,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to be an approver',
                style: { overflowWrap: 'break-word'}
            },
            {
                header: reqCount,
                meta: 'Number of Requests',
                description: 'Requests try to withdraw money from the contract. Requests must be approved by approvers',
                style: { overflowWrap: 'break-word'}
            },
            {
                header: appCount,
                meta: 'Number of Approvers',
                description: 'Number of people donated to the contract.',
                style: { overflowWrap: 'break-word'}
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left',
                style: { overflowWrap: 'break-word'}
            }
        ];

        return <Card.Group items={items} />
    }

    return (
        <>
            <h1>Campaign Details</h1>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={campId} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link href={`/campaigns/${campId}/requests`}>
                            <Button primary>View Requests</Button>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
}

export default CampaignDetail;
