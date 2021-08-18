import { useState } from 'react';
import router, { useRouter } from 'next/router';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

export const getServerSideProps = async ({ params }) => {
    const campId = params.campId;
    return {
        props: { campId }
    }
}

const RequestNew = ({ campId }) => {

    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [recipient, setRecipient] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        setErrMsg('');
        setLoading(true);

        try {
            const campaign = Campaign(campId);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({ from: accounts[0] });
            setValue('');
            router.push(`/campaigns/${campId}/requests`);
        } catch(err) {
            setErrMsg(err.message);
        }

        setLoading(false);
    }

    return (
        <>
            <h3>Create a Request</h3>
            <Form onSubmit={onSubmit} error={!!errMsg}>
                <Form.Field>
                    <label>Description</label>
                    <Input value={description} onChange={e => setDescription(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input value={value} onChange={e => setValue(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input value={recipient} onChange={e => setRecipient(e.target.value)} />
                </Form.Field>
                <Message error header="Ooops!" content={errMsg} />
                <Button loading={loading} primary>
                    Create!
                </Button>
            </Form>
        </>
    );
}

export default RequestNew;
