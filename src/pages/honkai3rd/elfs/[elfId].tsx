/** @jsxImportSource theme-ui */
import {
  Box,
  Card,
  Flex,
  Heading,
  Paragraph,
  Image,
} from '@theme-ui/components'
import { NextPageContext } from 'next'
import React from 'react'
import BattlesuitFeatureLabel from '../../../components/atoms/BattlesuitFeatureLabel'
import SecondaryLabel from '../../../components/atoms/SecondaryLabel'
import Breadcrumb from '../../../components/organisms/Breadcrumb'
import { ElfData } from '../../../lib/honkai3rd/elfs'
import { getElfById, listElfs } from '../../../server/data/honkai3rd/elfs'
import { generateI18NPaths, getI18NProps } from '../../../server/i18n'
import { translate, useTranslation } from '../../../lib/i18n'
import { useRouter } from 'next/router'
import Head from '../../../components/atoms/Head'
import { battlesuitFeatures } from '../../../lib/honkai3rd/battlesuits'
import { assetsBucketBaseUrl } from '../../../lib/consts'
import Honkai3rdLayout from '../../../components/layouts/Honkai3rdLayout'

interface ElfShowPageProps {
  elf: ElfData
}

const ElfShowPage = ({ elf }: ElfShowPageProps) => {
  const { locale } = useRouter()
  const { t } = useTranslation()

  return (
    <Honkai3rdLayout>
      <Head
        title={`${t('common.honkai-3rd')}: ${elf.name} - ${t(
          'common.abyss-lab'
        )}`}
        description={`${t('common.honkai-3rd')} ${t(
          'elfs-show.elf'
        )} / ${'⭐'.repeat(elf.baseRank)} / ${elf.features
          .map((feature) => {
            const featureData = battlesuitFeatures.find(
              (aFeature) => aFeature.value === feature
            )
            if (featureData == null) {
              return feature
            }

            const { label, krLabel } = featureData

            return translate(locale, { 'ko-KR': krLabel }, label)
          })
          .join(', ')}`}
      />

      <Box p={3}>
        <Breadcrumb
          items={[
            { href: '/honkai3rd', label: t('common.honkai-3rd') },
            { href: '/honkai3rd/elfs', label: t('common.elfs') },
            {
              href: `/honkai3rd/elfs/${elf.id}`,
              label: elf.name,
            },
          ]}
        />

        <Heading as='h1'>{elf.name}</Heading>

        <Box mb={3}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              width: [300, 400],
              height: [300, 400],
              borderRadius: 4,
            }}
          >
            <Image
              alt={elf.name}
              src={`${assetsBucketBaseUrl}/honkai3rd/elfs/${elf.id}.png`}
            />
          </Box>
        </Box>

        <Card mb={3}>
          <Box sx={{ p: 2, borderBottom: 'default' }}>
            {'⭐'.repeat(elf.baseRank)}
          </Box>
          <Flex p={2}>
            {elf.features.map((feature) => (
              <Box key={feature} mr={2}>
                <BattlesuitFeatureLabel feature={feature} />
              </Box>
            ))}
          </Flex>
        </Card>

        {elf.skillRows.map((row, rowIndex) => {
          return (
            <Card key={rowIndex} mb={3}>
              {row.map((item, columnIndex) => {
                return (
                  <React.Fragment key={columnIndex}>
                    <Box sx={{ p: 2, borderBottom: 'default' }}>
                      <Heading
                        as={columnIndex === 0 ? 'h2' : 'h3'}
                        sx={{ mb: 1 }}
                      >
                        {item.name}
                      </Heading>
                      <SecondaryLabel>
                        {t(`elfs-show.${item.type}`)}{' '}
                        {'⭐'.repeat(item.requiredRank)}
                      </SecondaryLabel>
                    </Box>
                    <Paragraph
                      sx={{
                        p: 2,
                        borderBottom: 'default',
                        '&:last-child': { borderBottom: 'none' },
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {item.description}
                    </Paragraph>
                  </React.Fragment>
                )
              })}
            </Card>
          )
        })}
      </Box>
    </Honkai3rdLayout>
  )
}

export default ElfShowPage

export async function getStaticProps({
  params,
  locale,
}: NextPageContext & { params: { elfId: string } }) {
  const elf = getElfById(params.elfId, locale)
  return {
    props: { elf, ...(await getI18NProps(locale)) },
  }
}

export async function getStaticPaths() {
  return {
    paths: generateI18NPaths(
      listElfs().map((elf) => {
        return {
          params: { elfId: elf.id },
        }
      })
    ),
    fallback: false,
  }
}
