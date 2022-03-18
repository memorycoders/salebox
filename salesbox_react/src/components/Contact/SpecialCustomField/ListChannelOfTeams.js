import React from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { ModalContent, Table, TableBody, TableRow, TableCell, Dimmer, Loader, Segment } from 'semantic-ui-react';
const ListChannelOfTeams = (props) => {
	const { listChannels, onClick, onDone, isFetchingChannel } = props;
	return <>
		<ModalCommon
			title={_l`Select list channel`}
			visible={listChannels && listChannels.status}
			size="tiny"
			onDone={onDone}
			onClose={onDone}
			cancelHidden={true}
		>
			<ModalContent>
			{isFetchingChannel ? 
				  (     
				  <Dimmer.Dimmable
					as={Segment}
					dimmed={isFetchingChannel}
					style={{ display: isFetchingChannel ? 'block' : 'none', height: '80px' }}
				  >
					<Dimmer active={isFetchingChannel}>
					  <Loader></Loader>
					</Dimmer>
				  </Dimmer.Dimmable>
				) : 
				<Table compact className="table-suggest">
				<TableBody>
				  {listChannels.data && listChannels.data.length > 0 ? listChannels.data.map((item, index) => (
					<TableRow onClick={() => {onClick(item)}} key={`list-channel-${index}`}>
					  <TableCell>
							<b>{item.displayName}</b>
							<p>{item.teamName}</p>
							</TableCell>
					</TableRow>
				  )) : <p>Not exist channels</p>}
				</TableBody>
			  </Table>
			}

			</ModalContent>
		</ModalCommon>
	</>
}

export default ListChannelOfTeams;
