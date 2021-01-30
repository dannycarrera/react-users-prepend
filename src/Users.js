import React, { useCallback, useState } from 'react'

import { Virtuoso } from 'react-virtuoso'
import faker from 'faker'

const generated = []

function toggleBg(index) {
  return index % 2 ? 'var(--ifm-background-color)' : 'var(--ifm-color-emphasis-200)'
}

function user(index = 0) {
  let firstName = faker.name.firstName()
  let lastName = faker.name.lastName()

  return {
    index: index + 1,
    bgColor: toggleBg(index),
    name: `${firstName} ${lastName}`,
    initials: `${firstName.substr(0, 1)}${lastName.substr(0, 1)}`,
    jobTitle: faker.name.jobTitle(),
    description: faker.lorem.sentence(10),
    longText: faker.lorem.paragraphs(1),
  }
}

const generateUsers = (length, startIndex = 0) => {
    return Array.from({ length }).map((_, i) => getUser(i + startIndex))
}

const getUser = index => {
    if (!generated[index]) {
        generated[index] = user(index)
    }

    return generated[index]
}

export default () => {
    console.log('RENDER: Users')
    const START_INDEX = 10000
    const INITIAL_ITEM_COUNT = 20

    const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX)
    console.log('firstItemIndex', firstItemIndex)
    const [users, setUsers] = useState(() => generateUsers(INITIAL_ITEM_COUNT, START_INDEX))
    console.log('users', users)
    const prependItems = useCallback(() => {
        console.log('prependItems()')
        const usersToPrepend = 20
        const nextFirstItemIndex = firstItemIndex - usersToPrepend

        setTimeout(() => {
            setFirstItemIndex(() => nextFirstItemIndex)
            setUsers(() => [...generateUsers(usersToPrepend, nextFirstItemIndex), ...users])
        }, 5)

        return false
    }, [firstItemIndex, users, setUsers])

    return (
        <Virtuoso
            components={{
                Header: () => <div style={{ textAlign: 'center', padding: '1rem' }}>Loading...</div>,
            }}
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={INITIAL_ITEM_COUNT - 1}
            data={users}
            startReached={prependItems}
            itemContent={(index, user) => {
                return (
                    <div style={{ backgroundColor: user.bgColor, padding: '1rem 0.5rem' }}>
                        <h4>
                            {user.index}. {user.name}
                        </h4>
                        <div style={{ marginTop: '1rem' }}>{user.description}</div>
                    </div>
                )
            }}
        />
    )
}