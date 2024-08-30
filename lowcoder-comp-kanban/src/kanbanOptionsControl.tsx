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
    Title: StringControl,
    Status: StringControl,
    Summary: StringControl,
    Type: StringControl,
    Priority: StringControl,
    Tags: StringControl,
    Estimate: NumberControl,
    Assignee: StringControl,
    RankId: NumberControl,
    Id: StringControl,
  },
  (props: any) => props
).build();

type OptionPropertyParam = {
  label?: string;
  Title?: string;
  Status?: string;
  Summary?: string;
  Type?: string;
  Priority?: string;
  Tags?: string;
  Estimate?: number;
  Assignee?: string;
  RankId?: number;
  Id?: number;
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
        {this.children.Title.propertyView({
          label: "Title",
        })}
        {this.children.Status.propertyView({
          label: "Status",
        })}
        {this.children.Summary.propertyView({
          label: "Summary",
        })}

        {this.children.Type.propertyView({
          label: "Type",
        })}

        {this.children.Priority.propertyView({
          label: "Priority",
        })}

        {this.children.Tags.propertyView({
          label: "Tags",
        })}

        {this.children.Estimate.propertyView({
          label: "Estimate",
        })}

        {this.children.Assignee.propertyView({
          label: "Assignee",
        })}

        {this.children.RankId.propertyView({
          label: "RankId",
        })}
      </>
    );
  }
};

export const KanbanOptionControl = optionsControl(KanbanOption, {
  initOptions: dataSource.cardData,
  uniqField: "Id",
});