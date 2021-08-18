import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, 
    '0x7e8fE01BaD5F9faad39Cf6516CaF8b6C71B1e13D');

export default instance;
