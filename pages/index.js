import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Link from 'next/link';

const renderCampaigns = (campaigns, router) => {

    const items = campaigns.map(campaign => {
        return {
            header: campaign.title,
            meta: campaign.manager,
            description: campaign.description,
            extra: <Link href={`/campaigns/${campaign.contractAddress}`}>View Campaign</Link>,
            fluid: true
        }
    })

    return (
        <div>
            <h3>Open Campaigns</h3>
            <Link href="/campaigns/new">
                <Button floated="right" content="Create Campaign" 
                    icon="add circle" primary />
            </Link>
            <Card.Group items={items} />
        </div>
    );
}


const CampaignIndex = () => {

    const router = useRouter();

    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const init = async () => {
            const c = await factory.methods.getDeployedCampaigns().call();
            console.log(c);
            setCampaigns(c);
        };
        init();
    }, [])

    return (
        <div>
            {renderCampaigns(campaigns, router)}
        </div>
    );
}

export default CampaignIndex;
