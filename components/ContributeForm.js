import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const ContributeForm = ({ address }) => {

    const router = useRouter();

    const [amount, setAmount] = useState(0);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        
        const campaign = Campaign(address);

        setErrMsg('');
        setLoading(true);

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(amount, 'ether')
            });
            setAmount(0);
            router.replace(`/campaigns/${address}`);
        } catch(err) {
            setErrMsg(err.message);
        }

        setLoading(false);
    }

    return (
        <>
            <Form onSubmit={onSubmit} error={!!errMsg}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input 
                        label="ether" labelPosition="right"
                        value={amount}
                        onChange={event => setAmount(event.target.value)}
                    />
                </Form.Field>
                <Message error header="Ooops!" content={errMsg} />
                <Button loading={loading} primary>Contribute!</Button>
            </Form>
        </>
    );
}

export default ContributeForm;
