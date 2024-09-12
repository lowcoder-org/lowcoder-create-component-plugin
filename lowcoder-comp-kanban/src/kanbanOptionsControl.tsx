import {
  MultiCompBuilder,
  StringControl,
  NumberControl,
  optionsControl,
} from 'lowcoder-sdk';
import * as dataSource from "./datasource.json";

let KanbanOption = new MultiCompBuilder(
  {
    label: StringControl,
    // Title: StringControl,
    status: StringControl,
    summary: StringControl,
    type: StringControl,
    priority: StringControl,
    tags: StringControl,
    estimate: NumberControl,
    assignee: StringControl,
    rankId: NumberControl,
    id: NumberControl,
  },
  (props: any) => props
).build();

type OptionPropertyParam = {
  label?: string;
  // Title?: string;
  status?: string;
  summary?: string;
  type?: string;
  priority?: string;
  tags?: string;
  estimate?: number;
  assignee?: string;
  rankId?: number;
  id?: number;
};

interface OptionCompProperty {
  propertyView(param: OptionPropertyParam): React.ReactNode;
}

KanbanOption = class extends KanbanOption implements OptionCompProperty {
  propertyView(param: any) {
    return (
      <>
        {this.children.label.propertyView({
          label: "Label",
        })}
        {/* {this.children.Title.propertyView({
          label: "Title",
        })} */}
        {this.children.status.propertyView({
          label: "Status",
        })}
        {this.children.summary.propertyView({
          label: "Summary",
        })}

        {this.children.type.propertyView({
          label: "Type",
        })}

        {this.children.priority.propertyView({
          label: "Priority",
        })}

        {this.children.tags.propertyView({
          label: "Tags",
        })}

        {this.children.estimate.propertyView({
          label: "Estimate",
        })}

        {this.children.assignee.propertyView({
          label: "Assignee",
        })}

        {this.children.rankId.propertyView({
          label: "RankId",
        })}
      </>
    );
  }
};

export const KanbanOptionControl = optionsControl(KanbanOption, {
  initOptions: dataSource.cardData,
  uniqField: "id",
  autoIncField: "id",
});