import { trans } from "./i18n/comps";
import {
  Section,
} from "lowcoder-sdk";
import { KanbanImplComp } from "./KabanComp";
import React from "react";

type Props = {
  comp: InstanceType<typeof KanbanImplComp>;
};

export const KanbanPropertyView = React.memo((props: Props) => {
  const { comp } = props;
  const children = comp.children;
  return (
    <>
      <Section name="Basic">
        {children.data.propertyView({})}
        {children.statusOptions.propertyView({
          label: 'Status Options'
        })}
        {children.assigneeOptions.propertyView({
          label: 'Assignee Options'
        })}
      </Section>
      <Section name="Customization">
        {children.separateAssigneeSections.propertyView({
          label: "Separate Sections By Assignees",
        })}
        {children.cardViewOption.propertyView({
          label: "Card View",
          radioButton: true,
        })}
        {children.cardViewOption.getView() === 'custom' && 
          children.cardView.getPropertyView()
        }
      </Section>  
      <Section name="Interaction">
        {children.onEvent.propertyView()}
      </Section>
      <Section name="Styles">
        {children.autoHeight.getPropertyView()}
        {!children.autoHeight.getView() &&
          children.scrollbars.propertyView({
            label: trans("prop.scrollbar"),
          })}
        {children.minCardWidth.propertyView({
            label: trans("style.minCardWidth"),
            placeholder: '250px',
          })}
      </Section>
      <Section name="Card Header Styling">
        {children.cardHeaderStyles.getPropertyView()}
      </Section>
      <Section name="Card Styling">
        {children.cardContentStyles.getPropertyView()}
      </Section>
      <Section name="Tag Styles">
        {children.tagStyles.getPropertyView()}
      </Section>
      <Section name="Board Styles">
        {children.boardStyles.getPropertyView()}
      </Section>

    </>
  );
});
