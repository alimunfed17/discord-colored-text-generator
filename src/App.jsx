import { useState } from 'react'
import { Container, Title, Text, Stack, Group, Button, Paper, ActionIcon, Tooltip, ColorInput, SegmentedControl } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCopy, IconRefresh, IconBold, IconUnderline, IconStrikethrough, IconItalic, IconAlignLeft, IconAlignCenter, IconAlignRight } from '@tabler/icons-react'

function App() {
  const [text, setText] = useState('')
  const [coloredText, setColoredText] = useState('')
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [textAlign, setTextAlign] = useState('left')
  const [copyButtonColor, setCopyButtonColor] = useState('#4f545c')

  const applyStyle = (style) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const span = document.createElement('span')
    
    switch(style) {
      case 'bold':
        span.style.fontWeight = '700'
        break
      case 'semibold':
        span.style.fontWeight = '600'
        break
      case 'underline':
        span.style.textDecoration = 'underline'
        break
      case 'strikethrough':
        span.style.textDecoration = 'line-through'
        break
      case 'italic':
        span.style.fontStyle = 'italic'
        break
      case 'align':
        const parent = range.commonAncestorContainer.parentElement
        if (parent.id === 'textarea') {
          parent.style.textAlign = textAlign
        } else {
          parent.style.textAlign = textAlign
        }
        return
      default:
        span.className = `ansi-${style}`
    }
    
    range.surroundContents(span)
  }

  const generateAnsiText = () => {
    const textarea = document.getElementById('textarea')
    const nodes = textarea.childNodes
    let ansiText = '```ansi\n'
    
    const processNode = (node) => {
      if (node.nodeType === 3) { // Text node
        return node.textContent
      }
      if (node.nodeName === 'BR') {
        return '\n'
      }
      
      const className = node.className
      if (!className) return node.textContent
      
      const ansiCode = className.split('-')[1]
      return `\x1b[${ansiCode}m${Array.from(node.childNodes).map(processNode).join('')}\x1b[0m`
    }
    
    ansiText += Array.from(nodes).map(processNode).join('')
    ansiText += '\n```'
    setColoredText(ansiText)
  }

  const copyToClipboard = () => {
    const textarea = document.getElementById('textarea')
    if (!textarea.textContent || textarea.textContent === 'Please provide your text here...') {
      notifications.show({
        title: 'No text to copy',
        message: 'Please provide some text first',
        color: 'red',
      })
      return
    }

    // Change button color to green
    setCopyButtonColor('#2ecc71')
    
    // Generate ANSI text first
    generateAnsiText()
    
    // Then copy the generated text
    navigator.clipboard.writeText(coloredText)
    notifications.show({
      title: 'Copied!',
      message: 'Text has been copied to clipboard',
      color: 'green',
    })

    // Reset button color after 1 second
    setTimeout(() => {
      setCopyButtonColor('#4f545c')
    }, 1000)
  }

  const resetAll = () => {
    const textarea = document.getElementById('textarea')
    textarea.innerHTML = ''
    textarea.style.textAlign = 'left'
  }

  const applyColors = () => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const span = document.createElement('span')
    span.style.color = foregroundColor
    span.style.backgroundColor = backgroundColor
    range.surroundContents(span)
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f7fa',
      padding: '2rem 0'
    }}>
      <Container size="md">
        <Stack spacing="xl" align="center">
          <Title order={1} align="center" style={{ 
            color: '#5865F2',
            background: 'linear-gradient(45deg, #5865F2, #7289DA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Discord Colored Text Generator
          </Title>

          <Paper shadow="sm" p="md" withBorder style={{ 
            backgroundColor: '#ffffff', 
            borderColor: '#e1e4e8',
            background: '#ffffff'
          }}>
            <Stack spacing="md">
              <Group position="center" spacing="xs">
                <Button 
                  variant="filled" 
                  color="gray" 
                  onClick={resetAll}
                  style={{ backgroundColor: '#4f545c' }}
                >
                  Reset All
                </Button>
                <Tooltip label="Bold">
                  <ActionIcon 
                    variant="filled" 
                    color="gray"
                    onClick={() => applyStyle('bold')}
                    style={{ backgroundColor: '#4f545c' }}
                  >
                    <IconBold size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Semibold">
                  <ActionIcon 
                    variant="filled" 
                    color="gray"
                    onClick={() => applyStyle('semibold')}
                    style={{ backgroundColor: '#4f545c' }}
                  >
                    <IconBold size={16} style={{ opacity: 0.7 }} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Italic">
                  <ActionIcon 
                    variant="filled" 
                    color="gray"
                    onClick={() => applyStyle('italic')}
                    style={{ backgroundColor: '#4f545c' }}
                  >
                    <IconItalic size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Underline">
                  <ActionIcon 
                    variant="filled" 
                    color="gray"
                    onClick={() => applyStyle('underline')}
                    style={{ backgroundColor: '#4f545c' }}
                  >
                    <IconUnderline size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Strikethrough">
                  <ActionIcon 
                    variant="filled" 
                    color="gray"
                    onClick={() => applyStyle('strikethrough')}
                    style={{ backgroundColor: '#4f545c' }}
                  >
                    <IconStrikethrough size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>

              <SegmentedControl
                value={textAlign}
                onChange={setTextAlign}
                data={[
                  { label: <IconAlignLeft size={16} />, value: 'left' },
                  { label: <IconAlignCenter size={16} />, value: 'center' },
                  { label: <IconAlignRight size={16} />, value: 'right' },
                ]}
                style={{ backgroundColor: '#f8f9fa' }}
              />

              <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
                <Stack spacing="md">
                  <Group grow>
                    <ColorInput
                      label="Foreground Color"
                      value={foregroundColor}
                      onChange={setForegroundColor}
                      format="hex"
                      swatches={[
                        '#4f545c', '#dc322f', '#859900', '#b58900',
                        '#268bd2', '#d33682', '#2aa198', '#2c3e50',
                        '#ff6b6b', '#98c379', '#e5c07b', '#61afef',
                        '#c678dd', '#56b6c2'
                      ]}
                      styles={{ input: { backgroundColor: '#ffffff', borderColor: '#e1e4e8', color: '#2c3e50' } }}
                    />
                    <ColorInput
                      label="Background Color"
                      value={backgroundColor}
                      onChange={setBackgroundColor}
                      format="hex"
                      swatches={[
                        '#ffffff', '#f8f9fa', '#f1f3f5', '#e9ecef',
                        '#dee2e6', '#ced4da', '#adb5bd', '#6c757d'
                      ]}
                      styles={{ input: { backgroundColor: '#ffffff', borderColor: '#e1e4e8', color: '#2c3e50' } }}
                    />
                  </Group>

                  <Button
                    variant="filled"
                    color="blue"
                    onClick={applyColors}
                    style={{ backgroundColor: '#5865F2' }}
                  >
                    Apply Colors
                  </Button>
                </Stack>
              </Paper>

              <div
                id="textarea"
                contentEditable
                placeholder="Please provide your text here..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  backgroundColor: '#2F3136',
                  color: '#B9BBBE',
                  border: '1px solid #202225',
                  borderRadius: '5px',
                  padding: '5px',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.125rem',
                  whiteSpace: 'pre-wrap',
                  textAlign: textAlign
                }}
                onFocus={(e) => {
                  if (e.target.innerHTML === '') {
                    e.target.innerHTML = ''
                  }
                }}
                onBlur={(e) => {
                  if (e.target.innerHTML === '') {
                    e.target.innerHTML = 'Please provide your text here...'
                  }
                }}
              />

              <Button
                variant="filled"
                color="blue"
                onClick={copyToClipboard}
                style={{ backgroundColor: copyButtonColor, transition: 'background-color 0.3s ease' }}
              >
                <Group spacing="xs">
                  <IconCopy size={16} />
                  <span>Copy text as Discord formatted</span>
                </Group>
              </Button>
            </Stack>
          </Paper>

          <Text size="xl" color="dimmed" align="center">
            This is a tool made by Munfed Ali. It is built for fun and clear an assignment.
          </Text>
        </Stack>
      </Container>
    </div>
  )
}

export default App
