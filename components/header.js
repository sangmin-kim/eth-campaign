import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

const Header = () => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Menu.Item>
                <Link href="/">
                    CrowdCoins
                </Link>
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item>
                    <Link href="/">
                        Campaigns
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/campaigns/new">
                    +
                    </Link>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
}

export default Header;