import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

const CampaignNew = () => {

    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [minCont, setMinCont] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        setErrMsg('');
        setLoading(true);

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(title, description, accounts[0], minCont).send({ 
                from: accounts[0]
            });
            router.push('/');
        } catch(err) {
            setErrMsg(err.message);
        }
        setLoading(false);
    }

    return (
        <div>
            <h3>Create a Campaign</h3>
            <Form onSubmit={onSubmit} error={!!errMsg}>
                <Form.Field>
                    <label>Title</label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <Input value={description} onChange={e=>setDescription(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input label="wei" labelPosition="right" value={minCont} 
                        onChange={e => setMinCont(e.target.value)} />
                </Form.Field>
                <Message error header="Oops!" content={errMsg} />
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </div>
    );
}

export default CampaignNew;
