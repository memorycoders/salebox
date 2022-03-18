//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Table } from 'semantic-ui-react';
import Collapsible from 'components/Collapsible/Collapsible';
import css from './SuggestNextStep.css';
import { WIDTH_DEFINE } from '../../../Constants';
import SuggestActionMenu from './SuggestActionMenu';


addTranslations({
    "se": {
        "{0}": "{0}"
    },
    'en-US': {
    },
});

export const SuggestNextStep = ({ data }: PropsT) => {

    return (
        <Collapsible width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT} padded title={_l`Next step`}>
            <Table className={css.paneTable} compact>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>{data.secondNextStep}</Table.Cell>
                        <Table.Cell><SuggestActionMenu /></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{data.firstNextStep}</Table.Cell>
                        <Table.Cell><SuggestActionMenu /></Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Collapsible>
    );
};
