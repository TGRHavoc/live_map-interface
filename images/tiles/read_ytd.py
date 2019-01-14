import os
import zlib
from PIL import Image
import io
import math


def extract_data_from_array(arr, count):
    return arr[:count], arr[count:]


class TextureData:
    LENGTH = 64

    def __init__(self, raw_data, reader):  # raw_data = 64 bytes from system data
        self.VTF, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_4h, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_8h, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_Ch, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_10h, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_14h, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_18h, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_1Ch, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_20h, raw_data = extract_data_from_array(raw_data, 4)
        self.unk_24h, raw_data = extract_data_from_array(raw_data, 4)
        self.name_pointer, raw_data = extract_data_from_array(raw_data, 8)
        self.Unknown_30h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_34h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_38h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_3Ch, raw_data = extract_data_from_array(raw_data, 4)

        self.name_pointer = int.from_bytes(self.name_pointer, 'little')

        temp = reader.read(self.name_pointer, 1)
        how_many_read = 0
        name = ""
        while temp != b'\x00':  # While not null terminator
            name += temp.decode("utf-8")
            how_many_read += 1
            temp = reader.read(self.name_pointer+how_many_read, 1)

        print("Read name: %s" % name)
        self.name = name


class TextureDX11(TextureData):
    LENGTH = 0x90

    def __init__(self, raw_data, reader):
        cpy = raw_data
        super().__init__(raw_data, reader)

        _, raw_data = extract_data_from_array(raw_data, TextureData.LENGTH)
		
        self.Unknown_40h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_44h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_48h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_4Ch, raw_data = extract_data_from_array(raw_data, 4)
        self.Width, raw_data = extract_data_from_array(raw_data, 2)
        self.Height, raw_data = extract_data_from_array(raw_data, 2)
        self.Unknown_54h, raw_data = extract_data_from_array(raw_data, 2)
        self.Stride, raw_data = extract_data_from_array(raw_data, 2)
        self.Format, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_5Ch, raw_data = extract_data_from_array(raw_data, 1)
        self.Levels, raw_data = extract_data_from_array(raw_data, 1)
        self.Unknown_5Eh, raw_data = extract_data_from_array(raw_data, 2)
        self.Unknown_60h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_64h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_68h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_6Ch, raw_data = extract_data_from_array(raw_data, 4)
        self.DataPointer, raw_data = extract_data_from_array(raw_data, 8)
        self.Unknown_78h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_7Ch, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_80h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_84h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_88h, raw_data = extract_data_from_array(raw_data, 4)
        self.Unknown_8Ch, raw_data = extract_data_from_array(raw_data, 4)

        self.Format = int.from_bytes(self.Format, "little")
        self.Width = int.from_bytes(self.Width, "little")
        self.Height = int.from_bytes(self.Height, "little")
        self.Levels = int.from_bytes(self.Levels, "little")
        self.Stride = int.from_bytes(self.Stride, "little")

        textureLength = 0
        length = self.Stride * self.Height
        for i in range(0, self.Levels):
            textureLength += length
            length /= 4
        textureLength = math.floor(textureLength)
        n = 1
        if self.Format == 894720068:
            n = 3

        textureDataRaw = reader.read(int.from_bytes(self.DataPointer, "little"), textureLength)

        Image.frombytes('RGBA', (self.Width, self.Height), textureDataRaw, "bcn", n).save("%s.png" % self.name)
        print("Done")


class SystemData:
    SYSTEM_CONST = ~0x50000000
    SYSTEM_BASE = 0x50000000

class GraphicsData:
    GFX_CONST = ~0x60000000
    GFX_BASE = 0x60000000

class Resources:

    def read_system(self, pos, count):
        start = pos & SystemData.SYSTEM_CONST
        return self.ytd.systemData[start:start+count]

    def read_gfx(self, pos, count):
        start = pos & GraphicsData.GFX_CONST
        return self.ytd.gfxData[start:start+count]

    def read(self, position, bytes=16):
        sp = position & SystemData.SYSTEM_BASE
        if sp == SystemData.SYSTEM_BASE:
            print("Reading from system")
            return self.read_system(position, bytes)
        elif (position & GraphicsData.GFX_BASE) == GraphicsData.GFX_BASE:
            print("Reading from GFX")
            return self.read_gfx(position, bytes)
        else:
            raise Exception("Invalid position")

    def __init__(self, ytdfile):
        self.ytd = ytdfile
        # Skip the first 48 bytes... They're not useful.. I hope
        resourcePointerArrayStart = 48

        resourceData = ytdfile.systemData[resourcePointerArrayStart:resourcePointerArrayStart+16]  # Read the resource data line

        arrayPointerStart = resourceData[:8]  # Where does the resource array info start?
        resourceData = resourceData[8:]

        resourceCount = resourceData[:2]
        resourceData = resourceData[2:]

        resourceCapacity = resourceData[:2]
        resourceData = resourceData[2:]

        print("Pointer: 0x%x, Entry count: %i, Entry capacity: %i" %
              (int.from_bytes(arrayPointerStart, 'little'), int.from_bytes(resourceCount, 'little'),
               int.from_bytes(resourceCapacity, 'little')))

        self.read(int.from_bytes(arrayPointerStart, "little"))

        textures = []
        for i in range(0, int.from_bytes(resourceCount, 'little')):
            offset = i * 8
            #pointerLocation = int.from_bytes(resourcePointer, 'little') & ~0x50000000
            pointerDataLocation = self.read(int.from_bytes(arrayPointerStart, 'little')+offset, 8)  # The real location of the textures

            # pointersRealLocation = int.from_bytes(pointerData, 'little') & ~0x50000000
            textureData = TextureDX11(self.read(int.from_bytes(pointerDataLocation, 'little'), TextureDX11.LENGTH), self)
            textures.append(textureData)


class YTD:
    DEFAULT_SIZE = 0x2000

    def G(self, systemFlag, graphicsFlag):
        return int(((graphicsFlag >> 28) & 0xF) | (((systemFlag >> 28) & 0xF) << 4))

    def sizeFromFlag(self, flag, baseSize):
        baseSize <<= int(flag & 0xf)
        size = int((((flag >> 17) & 0x7f) + (((flag >> 11) & 0x3f) << 1) + (((flag >> 7) & 0xf) << 2) + (
                    ((flag >> 5) & 0x3) << 3) + (((flag >> 4) & 0x1) << 4)) * baseSize)
        print("Adding size %i, basesize: %i" % (size, baseSize))
        i = 0
        while i < 4:
            # size += (((flag >> (24 + i)) & 1) == 1) ? (baseSize >> (1 + i)) : 0;
            if (flag >> (24 + i)) & 1 == 1:
                size += (baseSize >> (1 + i))
            i += 1
        return size

    def inflate(self, data):
        decompress = zlib.decompressobj(
            -zlib.MAX_WBITS  # see above
        )
        inflated = decompress.decompress(data)
        inflated += decompress.flush()
        return inflated

    def calcSytemSize(self, sysFlag):
        s16 = int(sysFlag >> 27) & 0x1
        s8 = int(sysFlag >> 26) & 0x1
        s4 = int(sysFlag >> 25) & 0x1
        s2 = int(sysFlag >> 24) & 0x1
        m1 = int(sysFlag >> 17) & 0x7f
        m2 = int(sysFlag >> 11) & 0x3f
        m4 = int(sysFlag >> 7) & 0xf
        m8 = int(sysFlag >> 5) & 0x3
        m16 = int(sysFlag >> 4) & 0x1
        shiftSize = int(sysFlag >> 0) & 0xf
        baseSize = self.DEFAULT_SIZE << shiftSize

        print("Shift (system) : %i" % shiftSize)

        self.SYSTEM_SIZE = int(baseSize * s16 / 16 + \
                      baseSize * s8 / 8 + \
                      baseSize * s4 / 4 + \
                      baseSize * s2 / 2 + \
                      baseSize * m1 * 1 + \
                      baseSize * m2 * 2 + \
                      baseSize * m4 * 4 + \
                      baseSize * m8 * 8 + \
                      baseSize * m16 * 16)

    def calculateGfxSize(self, gfxFlag):
        s16 = int(gfxFlag >> 27) & 0x1
        s8 = int(gfxFlag >> 26) & 0x1
        s4 = int(gfxFlag >> 25) & 0x1
        s2 = int(gfxFlag >> 24) & 0x1
        m1 = int(gfxFlag >> 17) & 0x7f
        m2 = int(gfxFlag >> 11) & 0x3f
        m4 = int(gfxFlag >> 7) & 0xf
        m8 = int(gfxFlag >> 5) & 0x3
        m16 = int(gfxFlag >> 4) & 0x1
        shiftSize = int(gfxFlag >> 0) & 0xf
        baseSize = self.DEFAULT_SIZE << shiftSize
        print("Shift (gfx) : %i" % shiftSize)

        self.GFX_SIZE = int(baseSize * s16 / 16 + \
                   baseSize * s8 / 8 + \
                   baseSize * s4 / 4 + \
                   baseSize * s2 / 2 + \
                   baseSize * m1 * 1 + \
                   baseSize * m2 * 2 + \
                   baseSize * m4 * 4 + \
                   baseSize * m8 * 8 + \
                   baseSize * m16 * 16)

    def __init__(self, filename):
        self.fs = f = open(filename, "rb")
        magic = f.read(4)
        version = int.from_bytes(f.read(4), "little")
        sysFlag = int.from_bytes(f.read(4), "little")
        gfxFlag = int.from_bytes(f.read(4), "little")

        calcVersion = self.G(sysFlag, gfxFlag)

        if version != 13:
            print("Not a valid YTD file")
            exit()

        print("Magic: %s, 0x%x" % (str(magic), int.from_bytes(magic, "little")))
        print("Version in header: %i" % version)
        print("System flag = %i, Graphics flag = %i" % (sysFlag, gfxFlag))

        valid = "Not valid RSC7 format"
        if calcVersion == version:
            valid = "Valid RSC7 header"

        print("Calculated version '%i'. %s" % (calcVersion, valid))
        self.calcSytemSize(sysFlag)
        self.calculateGfxSize(gfxFlag)

        streamLength = os.fstat(f.fileno()).st_size

        sizeFromFlags = self.SYSTEM_SIZE + self.GFX_SIZE + 0x10
        print("Size calculated: %i, Size of system: %i, Size of gfx: %i. SIZE: %i"
              % (sizeFromFlags, self.SYSTEM_SIZE, self.GFX_SIZE, streamLength))
        self.decompress(sizeFromFlags)

        self.resources = Resources(self)

    def decompress(self, sizeFromFlags):
        uncompressed = self.inflate(self.fs.read(int(sizeFromFlags)))
        # print(uncompressed)
        self.systemData = uncompressed[0:int(self.SYSTEM_SIZE)]
        self.gfxData = uncompressed[int(self.SYSTEM_SIZE):int(self.SYSTEM_SIZE + self.GFX_SIZE)]
    def finished(self):
        self.fs.close()
    def dump(self):
        sf = open("system.dat", "wb")
        sf.write(self.systemData)
        sf.close()

        gd = open("gfx.dat", "wb")
        gd.write(self.gfxData)
        gd.close()
