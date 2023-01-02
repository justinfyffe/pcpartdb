import { getCompanyLogoImagePath } from '@client/image';
import { formatSpec } from '@client/part';
import { getGpuName } from '@client/part/part-utils';
import { AutocompleteOption, Img } from '@client/shared/components';
import { DateFormatter } from '@client/shared/format';
import { Part } from '@shared/part';
import React, { FunctionComponent } from 'react';

interface PartAutocompleteOptionProps {
  index: number;
  part: Part;
}

export const PartAutocompleteOption: FunctionComponent<
  PartAutocompleteOptionProps
> = (props) => {
  const { index, part } = props;

  const id = part.id;
  const name = getGpuName(part, { company: false });
  const image = getCompanyLogoImagePath(part);

  const releaseDate = formatSpec(part.specs?.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });
  const price = formatSpec(part.specs?.launchPrice);

  return (
    <AutocompleteOption index={index} label={name} value={`${id}`}>
      <div className="flex flex-1 items-center gap-4">
        {image != null ? <Img src={image} className="h-5" /> : <></>}
        <span className="flex-1 text-sm">{getGpuName(part)}</span>
        <div className="flex flex-col gap-1 items-end text-2xs">
          <div className="text-[#aaa]">{releaseDate}</div>
          <div className="text-[#aaa]">{price}</div>
        </div>
      </div>
    </AutocompleteOption>
  );
};
