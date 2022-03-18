import React, { useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import css from '../Settings/Settings.css';
import common from 'style/Common.css';
import ImportFile from './ImportFile';
import ImportHistory from './ImportHistory';
import ExportHistory from './ExportHistory';

const ImportCsv = (props) => {
  const [inProcessing, setProcessing] = useState(false);
  const [isLoading, setLoading] = useState(false)

  return (
    <div
      style={{ padding: 10, background: 'rgb(240,240,240)', overflowY: 'auto' }}
      className={`${common.container} ${common.positionAbsolute} ${css.container}`}
    >
      {isLoading ?  <Loader active  size="large"></Loader> : null }
        <Grid columns={inProcessing ? 1 : 3}>
        <Grid.Row>
          <Grid.Column>
            <ImportFile setLoading={setLoading} setProcessing={setProcessing} />
          </Grid.Column>
          {!inProcessing && (
            <>
              <Grid.Column>
                <ImportHistory />
              </Grid.Column>
              <Grid.Column>
                <ExportHistory />
              </Grid.Column>
            </>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
};
export default ImportCsv;
