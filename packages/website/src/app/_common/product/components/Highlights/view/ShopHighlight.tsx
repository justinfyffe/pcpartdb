import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { formatProductName, getAffiliateUrl, Product } from '@pcpartdb/shared';
import { AmazonButton } from 'packages/website/src/app/_common/components/Button/AmazonButton';
import React from 'react';
import { HighlightCard } from '../../../../components/Card/HighlightCard';

interface ShopHighlightProps {
  product: Product;
  className?: string;
  disclaimer?: boolean;
}

export function ShopHighlight(props: ShopHighlightProps) {
  const { product, className } = props;

  const url = getAffiliateUrl(product);
  const name = formatProductName(product, { company: false });

  if (!url) {
    return <></>;
  }

  return (
    <HighlightCard
      icon={<ShoppingCartIcon />}
      leftTitle={`Shop ${name}`}
      className={className}
      contentClassName="gap-1 justify-center"
    >
      <AmazonButton href={url} target="_blank" rel="noopener nofollow">
        Check Price on Amazon
      </AmazonButton>
    </HighlightCard>
  );
}
