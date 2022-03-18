import * as React from 'react';
import { Progress, Segment, Grid, Image, Popup } from 'semantic-ui-react';
import css from './getStarted.css';
import _l from 'lib/i18n';
import step5 from '../../../public/step5.svg';
import step3 from '../../../public/step3.svg';
import step1 from '../../../public/step1.svg';
import step2 from '../../../public/step2.svg';
import step4 from '../../../public/step4.svg';
import notDone from '../../../public/Check.svg';
import done from '../../../public/CheckHistory.svg';
import api from 'lib/apiClient';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUser } from '../../components/Auth/auth.selector';

class getStartedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
    };
  }

  async componentDidMount() {
    // call api here
    try {
      const res = await api.get({
        resource: `/enterprise-v3.0/user/getStartedPage`,
      });
      if (res) {
        await this.setState({ res: res.startedPageDTOList });
      }
    } catch (error) {
      // handle exception
    }
  }

  getOptionByName = (name) => {
    const { res } = this.state;
    return res.filter((e) => e.name === name)[0];
  };

  gotoInter = () => {
    this.props.history.push('/my-integrations');
  };

  gotoCSV = () => {
    this.props.history.push('/importCsv');
  };

  gotoCF = () => {
    this.props.history.push('/settings/custom-fields');
  };

  gotoProduct = () => {
    this.props.history.push('/settings/product');
  };

  gotoOrgan = () => {
    this.props.history.push('/settings/company-info');
  };
  getStatus = () => {
    const { res } = this.state;
    return res.filter((e) => e.done === true);
  };

  updateCategory = (name) => {
    let option = this.getOptionByName(name) ? this.getOptionByName(name) : null;
    let newArray = [...this.state.res.filter((e) => e.name !== name), { ...option, done: !option.done }];
    this.setState({ res: newArray });
    const res = api.post({
      resource: `/enterprise-v3.0/user/updateStartedPage`,
      data: { startedPageDTOList: newArray },
    });
  };
  render() {
    let percent = (this.getStatus().length * 100) / 21;

    const { user } = this.props;

    return (
      <Segment className={css.startPage} basic>
        <div className={css.progressBar}>
          <div className={css.header}>
            {' '}
            <span className={css.text}>{_l`How to get started in the most structured way`}</span>
          </div>
          <Progress percent={percent} color="blue" />
        </div>
        <div className={css.gridStep}>
          <Grid columns={5} divided>
            <Grid.Row>
              <Grid.Column>
                <div className={css.numberHeader}>
                  <Image className={css.number2} src={step1} />
                </div>
                <div className={css.title}>{_l`Add companies / contacts`}</div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`From Linkedin`}</div>
                  {this.getOptionByName('From Linkedin') && this.getOptionByName('From Linkedin').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('From Linkedin')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('From Linkedin')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`.CSV imports`}</div>
                  {this.getOptionByName('.CSV imports') && this.getOptionByName('.CSV imports').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('.CSV imports')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('.CSV imports')} />
                    </div>
                  )}
                </div>
                <div className={css.blank} />
                {user?.isAdmin && (
                  <div
                    onClick={() => this.gotoCSV()}
                    className={css.addNoteButton}
                    size="small"
                    fluid
                  >{_l`.CSV imports`}</div>
                )}
              </Grid.Column>
              <Grid.Column>
                <div className={css.numberHeader}>
                  <Image className={css.number2} src={step2} />
                </div>
                <div className={css.title}>{_l`Connect your tools`}</div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Email sync`}</div>
                  {this.getOptionByName('Email sync') && this.getOptionByName('Email sync').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Email sync')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Email sync')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Calendar sync`}</div>
                  {this.getOptionByName('Calendar sync') && this.getOptionByName('Calendar sync').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Calendar sync')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Calendar sync')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Microsoft Teams`}</div>
                  {this.getOptionByName('Microsoft teams') && this.getOptionByName('Microsoft teams').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Microsoft teams')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Microsoft teams')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Leadclipper`}</div>
                  {this.getOptionByName('Lead Clipper') && this.getOptionByName('Lead Clipper').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Lead Clipper')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Lead Clipper')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Documents`}</div>
                  {this.getOptionByName('Documents') && this.getOptionByName('Documents').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Documents')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Documents')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Mailchimp`}</div>
                  {this.getOptionByName('Mailchimp') && this.getOptionByName('Mailchimp').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Mailchimp')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Mailchimp')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Fortnox`}</div>
                  {this.getOptionByName('Fortnox') && this.getOptionByName('Fortnox').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Fortnox')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Fortnox')} />
                    </div>
                  )}
                </div>
                <div className={css.blank} />
                <div
                  onClick={() => this.gotoInter()}
                  className={css.addNoteButton}
                  size="small"
                  fluid
                >{_l`Integrations`}</div>
                {/* { <div className={css.addNoteButton1} size="small" fluid>{_l`Company integarations`}</div> } */}
              </Grid.Column>
              <Grid.Column>
                <div className={css.numberHeader}>
                  <Image className={css.number} src={step3} />
                </div>
                <Popup
                  trigger={<div className={css.title}>{_l`Add products/services`}</div>}
                  style={{ fontSize: 11 }}
                  position="bottom center"
                  content={
                    <div className={css.popup}>
                      <div className={css.headerPopup}>{_l`Why?`}</div>
                      <div
                        className={css.contentPoup}
                      >{_l`The whole purpose with having a product directory rather than just typing what you are selling as free text on each deal is to:`}</div>
                      <ul>
                        <li>{_l`Simplify for your user by pre-defining choices`}</li>
                        <li>{_l`Get one common structure over time`}</li>
                        <li>{_l`Enable search on contacts, companies and deals based on what products they have purchased or have in the pipeline`}</li>
                        <li>{_l`To enable stats on what takes time to sell, what generates biggest, fastest, most profitable deals etc.`}</li>
                      </ul>
                    </div>
                  }
                />
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Product group`}</div>
                  {this.getOptionByName('Product group') && this.getOptionByName('Product group').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Product group')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Product group')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Product type`}</div>
                  {this.getOptionByName('Product type') && this.getOptionByName('Product type').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Product type')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Product type')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Products`}</div>
                  {this.getOptionByName('Products') && this.getOptionByName('Products').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Products')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Products')} />
                    </div>
                  )}
                </div>
                <div className={css.blank} />
                {user?.isAdmin && (
                  <div
                    onClick={() => this.gotoProduct()}
                    className={css.addNoteButton}
                    size="small"
                    fluid
                  >{_l`Products`}</div>
                )}
              </Grid.Column>
              <Grid.Column>
                <div className={css.numberHeader}>
                  <Image className={css.number} src={step4} />
                </div>
                <Popup
                  trigger={<div className={css.title}>{_l`Build your team`}</div>}
                  style={{ fontSize: 11 }}
                  position="bottom center"
                  content={
                    <div className={css.popup}>
                      <div className={css.headerPopup}>{_l`Focus on key roles`}</div>
                      <div
                        className={css.contentPoup}
                      >{_l`Unlock collaboration across your business, Salesbox focuses on what matters for the broader business. Increased collaboration, transparency & focus grows your business. Read more on salesbox.com about how different roles use Salesbox and what KPIs that are relevant for each role.`}</div>
                    </div>
                  }
                />
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Sales`}</div>
                  {this.getOptionByName('Sales') && this.getOptionByName('Sales').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Sales')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Sales')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Management`}</div>
                  {this.getOptionByName('Management') && this.getOptionByName('Management').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Management')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Management')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Marketing`}</div>
                  {this.getOptionByName('Marketing') && this.getOptionByName('Marketing').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Marketing')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Marketing')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Finance/HR`}</div>
                  {this.getOptionByName('Finance/HR') && this.getOptionByName('Finance/HR').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Finance/HR')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Finance/HR')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Delivery`}</div>
                  {this.getOptionByName('Delivery') && this.getOptionByName('Delivery').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Delivery')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Delivery')} />
                    </div>
                  )}
                </div>
                <div className={css.blank} />
                {user?.isAdmin && (
                  <div
                    onClick={() => this.gotoOrgan()}
                    className={css.addNoteButton}
                    size="small"
                    fluid
                  >{_l`Organisation`}</div>
                )}
              </Grid.Column>
              <Grid.Column>
                <div className={css.numberHeader}>
                  <Image className={css.number} src={step5} />
                </div>
                <Popup
                  trigger={<div className={css.title}>{_l`Customise to fit`}</div>}
                  style={{ fontSize: 11 }}
                  position="bottom center"
                  content={
                    <div className={css.popup}>
                      <div
                        className={css.headerPopup}
                      >{_l`Become even more efficient with a customised information structure`}</div>
                      <div
                        className={css.contentPoup}
                      >{_l`When working with many contacts, companies and deals it can over time become a nightmare to manage all information.`}</div>
                      <div
                        className={css.contentPoup}
                      >{_l`The importance of smart and fast searches increases with large data volumes.`}</div>
                      <div
                        className={css.contentPoup}
                      >{_l`When dealing with large volumes of data it can therefore be good to extend the infromation structure with custom fields to make it easier to identify/search for specific segments.`}</div>
                    </div>
                  }
                />
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Companies`}</div>
                  {this.getOptionByName('Companies') && this.getOptionByName('Companies').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Companies')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Companies')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Contacts`}</div>
                  {this.getOptionByName('Contacts') && this.getOptionByName('Contacts').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Contacts')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Contacts')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Prospects`}</div>
                  {this.getOptionByName('Prospects') && this.getOptionByName('Prospects').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Prospects')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Prospects')} />
                    </div>
                  )}
                </div>
                <div className={css.content}>
                  <div className={css.subtitle}>{_l`Deals`}</div>
                  {this.getOptionByName('Deals') && this.getOptionByName('Deals').done ? (
                    <div className={css.done}>
                      <Image className={css.img} src={done} onClick={() => this.updateCategory('Deals')} />
                    </div>
                  ) : (
                    <div className={css.notdone}>
                      <Image className={css.img} src={notDone} onClick={() => this.updateCategory('Deals')} />
                    </div>
                  )}
                </div>
                <div className={css.blank} />
                {user?.isAdmin && (
                  <div
                    onClick={() => this.gotoCF()}
                    className={css.addNoteButton}
                    size="small"
                    fluid
                  >{_l`Custom fields`}</div>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: getUser(state),
});
export default connect(mapStateToProps, null)(getStartedView);
